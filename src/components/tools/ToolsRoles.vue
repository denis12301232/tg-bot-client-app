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
      :pagination-label="(f, l, a) => `${f}-${l} ${t('table.of')} ${a}`"
      :loading-label="t('table.loading')"
      :no-data-label="t('table.noData')"
      :rows-per-page-label="t('table.show')"
      :no-results-label="t('table.notFound')"
      :selected-rows-label="(n) => `${t('table.selected')} ${n}`"
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
          :label="t('tools.roles.table.search')"
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
import { useRequest, useFetch, useI18nT } from '@/hooks';
import { ToolsService } from '@/api/services';

const { t } = useI18nT();
const { request, loading } = useFetch(ToolsService.updateRoles, {
  alert: true,
  successMsg: t('tools.roles.msgs.update'),
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
  { label: t('tools.roles.table.columns.checkbox.user'), value: 'user', disable: true },
  { label: t('tools.roles.table.columns.checkbox.admin'), value: 'admin' },
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
