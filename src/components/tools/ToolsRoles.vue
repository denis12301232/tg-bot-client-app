<template>
  <div class="form">
    <h5 class="q-my-lg text-center">Настроить роли пользователей</h5>
    <QTable
      v-model:pagination="pagination"
      :rows="users"
      :columns="columns"
      :rows-per-page-options="[5, 10]"
      :filter="filter"
      :loading="loading || isUpdateLoading"
      binary-state-sort
      separator="cell"
      row-key="_id"
      no-data-label="Список пуст"
      @request="onRequest"
    >
      <template #top>
        <QInput v-model="filter" class="full-width" debounce="300" borderless dense clearable label="Поиск">
          <template #append>
            <QIcon name="search" />
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
                :disable="isUpdateLoading"
                @update:model-value="onUpdateRoles(row._id, row.roles)"
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
import { useFetch, useRequest } from '@/hooks';
import { ToolsService } from '@/api/services';

onMounted(() => onRequest({ pagination: pagination.value }));

const { pagination, data: users, filter, loading, onRequest } = useRequest<IUser>({
  f: ToolsService.getUsers
});
const { f: onUpdateRoles, loading: isUpdateLoading } = useFetch({
  fn: ToolsService.updateRoles,
  alert: true,
  successMsg: 'Обновлено',
});

const options = [
  { label: 'Пользователь', value: 'user', disable: true },
  { label: 'Админ', value: 'admin' },
];
const columns: QTable['columns'] = [
  { name: 'name', label: 'Имя', align: 'left', field: 'name' },
  { name: 'login', label: 'Логин', align: 'left', field: 'login' },
  { name: 'roles', label: 'Роль', align: 'center', field: 'roles' },
];
</script>

<style scoped lang="scss">
.form {
  padding: 0 20px;
}

@media (max-width: 480px) {
  .form {
    padding: 0;
  }
}
</style>
