<template>
  <div class="column items-center q-pa-sm">
    <h5 class="q-pa-md text-center">{{ t('tools.roles.title') }}</h5>
    <QTable
      v-model:pagination="pagination"
      :class="$style.table"
      :rows="users"
      :columns="columns"
      :rows-per-page-options="[5, 10]"
      :filter="filter"
      :loading="isUsersLoading || loading"
      :pagination-label="(f, l, a) => `${f}-${l} ${t('extra.table.of')} ${a}`"
      :loading-label="t('extra.table.loading')"
      :no-data-label="t('extra.table.noData')"
      :rows-per-page-label="t('extra.table.show')"
      :no-results-label="t('extra.table.notFound')"
      :selected-rows-label="(n) => `${t('extra.table.selected')} ${n}`"
      binary-state-sort
      separator="cell"
      row-key="_id"
      virtual-scroll
      :virtual-scroll-sticky-size-start="48"
      @request="getUsers"
    >
      <template #top>
        <QInput
          v-model="filter"
          class="full-width"
          debounce="300"
          borderless
          dense
          clearable
          :label="t('tools.roles.table.search.placeholder')"
        >
          <template #append>
            <QIcon name="eva-search" />
          </template>
        </QInput>
      </template>
      <template #body="{ row }: { row: IUser }">
        <QTr :key="row._id">
          <QTd>{{ row.name }}</QTd>
          <QTd>{{ row.login }}</QTd>
          <QTd auto-width>
            <div>
              <QOptionGroup
                v-model="row.roles"
                type="checkbox"
                :options="options"
                :disable="loading"
                @update:model-value="request(row._id, row.roles)"
              >
              </QOptionGroup>
            </div>
          </QTd>
        </QTr>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { IUser } from '@/types';
import { onMounted, computed } from 'vue';
import { useRequest, useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { request, loading } = useFetch(ToolsService.updateRoles, {
  alert: true,
  successMsg: t('tools.roles.messages.update'),
});
const {
  request: getUsers,
  pagination,
  filter,
  loading: isUsersLoading,
  data: users,
} = useRequest<IUser>(ToolsService.getUsers, { limit: 3 });
const columns = computed<QTable['columns']>(() => [
  { name: 'name', label: t('tools.roles.table.columns.name'), align: 'left', field: 'name' },
  { name: 'login', label: t('tools.roles.table.columns.login'), align: 'left', field: 'login' },
  { name: 'roles', label: t('tools.roles.table.columns.role'), align: 'center', field: 'roles' },
]);
const options = computed(() => [
  { label: t('tools.roles.table.checkboxes.user'), value: 'user', disable: true },
  { label: t('tools.roles.table.checkboxes.admin'), value: 'admin' },
]);

onMounted(() => getUsers({ pagination: pagination.value }));
</script>

<style lang="scss" module>
.table {
  max-width: 500px;
  width: 100%;
  max-height: calc(100vh - 210px);
}
</style>
