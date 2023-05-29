<template>
  <div class="column items-center q-pa-sm">
    <h5 class="q-pa-lg text-center">Настроить роли пользователей</h5>
    <QTable
      v-model:pagination="pagination"
      :class="$style.table"
      :rows="users"
      :columns="columns"
      :rows-per-page-options="[5, 10]"
      :filter="filter"
      :loading="isUsersLoading || loading"
      binary-state-sort
      separator="cell"
      row-key="_id"
      @request="getUsers"
    >
      <template #top>
        <QInput v-model="filter" class="full-width" debounce="300" borderless dense clearable label="Поиск">
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
import { onMounted } from 'vue';
import { useRequest, useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';

const { request, loading } = useFetch(ToolsService.updateRoles);
const { request: getUsers, pagination, filter, loading: isUsersLoading, data: users } = useRequest<IUser>(
  ToolsService.getUsers,
  { limit: 3 }
);

const columns: QTable['columns'] = [
  { name: 'name', label: 'Имя', align: 'left', field: 'name' },
  { name: 'login', label: 'Логин', align: 'left', field: 'login' },
  { name: 'roles', label: 'Роль', align: 'center', field: 'roles' },
];
const options = [
  { label: 'Пользователь', value: 'user', disable: true },
  { label: 'Админ', value: 'admin' },
];

onMounted(() => getUsers({ pagination: pagination.value }));
</script>

<style lang="scss" module>
.table {
  max-width: 500px;
  width: 100%;
}
</style>
