<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-my-lg q-pb-sm">{{ t('list.title') }}</h4>
    <QTable
      v-model:pagination="pagination"
      v-model:selected="select"
      :class="$style.table"
      :columns="columns"
      :rows="list"
      :loading="loading || isDelLoading"
      :filter="filter"
      :rows-per-page-options="[5, 10, 20, 50]"
      binary-state-sort
      :pagination-label="(f, l, a) => `${f}-${l} ${t('table.of')} ${a}`"
      :loading-label="t('table.loading')"
      :no-data-label="t('table.noData')"
      :rows-per-page-label="t('table.show')"
      :no-results-label="t('table.notFound')"
      :selected-rows-label="(n) => `${t('table.selected')} ${n}`"
      row-key="_id"
      separator="cell"
      selection="multiple"
      @request="request"
    >
      <template #header-selection>
        <QBtn
          dense
          round
          flat
          icon="eva-trash"
          color="negative"
          :disable="loading || isDelLoading || !select.length"
          @click="onDelete(ids)"
        >
          <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('list.hints.delete') }}</QTooltip>
        </QBtn>
      </template>
      <template #body="scope: { row: ListResponse, rowIndex: number, selected: boolean }">
        <QTr :key="scope.row._id">
          <QTd><QCheckbox v-model="scope.selected" /></QTd>
          <QTd class="text-center" auto-width>{{ scope.rowIndex + 1 }}</QTd>
          <QTd :class="$style.item_fio" @click="$router.push(`/info/${scope.row._id}`)">{{ scope.row.fio }}</QTd>
          <QTd auto-width>
            <div class="row justify-center">
              <QBtn dense round flat icon="eva-copy" color="indigo" @click="Util.copyTextToClipboard(scope.row.fio)">
                <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('list.hints.copy') }}</QTooltip>
              </QBtn>
            </div>
          </QTd>
        </QTr>
      </template>
      <template #top>
        <QInput
          class="full-width"
          v-model="filter"
          debounce="300"
          borderless
          dense
          clearable
          :placeholder="t('list.table.search')"
        >
          <template #append>
            <QIcon name="eva-search" />
          </template>
        </QInput>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { ListResponse, I18n, Langs } from '@/types';
import { onMounted, ref, computed } from 'vue';
import { useRequest, useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

type T = { acknowledged: boolean; deletedCount: number };
type S = typeof AssistanceService['deleteForms'];

const { t } = useI18n<I18n, Langs>({ useScope: 'global' });
const select = ref<ListResponse[]>([]);
const ids = computed(() => select.value.map((item) => item._id));
const { request, pagination, data: list, loading, filter } = useRequest<ListResponse>(AssistanceService.getHumansList, {
  sort: 'fio',
  descending: false,
  limit: 5,
});
const { request: onDelete, loading: isDelLoading } = useFetch<T, S>(AssistanceService.deleteForms, {
  afterResponse: ({ data }) => data.value.acknowledged && request({ pagination: pagination.value }),
});
const columns = computed<QTable['columns']>(() => [
  {
    name: 'index',
    label: t('list.table.columns.number'),
    align: 'center',
    field: 'index',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'fio',
    label: t('list.table.columns.fio'),
    align: 'center',
    field: 'fio',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'buttons',
    label: t('list.table.columns.actions'),
    align: 'center',
    field: 'buttons',
    headerStyle: 'font-size: 1.1em;',
  },
]);

onMounted(() => request({ pagination: pagination.value }));
</script>

<style lang="scss" module>
.table {
  max-width: 600px;
  width: 100%;
}

.item_fio {
  cursor: pointer;

  &:hover {
    color: $teal;
  }
}
</style>
