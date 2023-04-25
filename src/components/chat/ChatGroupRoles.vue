<template>
  <QCard :class="$style.container">
    <QCardSection class="text-h4 text-center">Настроить роли</QCardSection>
    <QTable
      :columns="columns"
      :rows="currentChat?.users"
      :loading="loading"
      :rows-per-page-options="[5, 10]"
      binary-state-sort
      separator="cell"
      no-data-label="Ничего не найдено"
      bordered
    >
      <template #body="{ row }: { row: IUser }">
        <QTr>
          <QTd key="name">{{ row.name }}</QTd>
          <QTd key="login">{{ row.login }}</QTd>
          <QTd key="roles" auto-width>
            <div>
              <QCheckbox
                v-model="hasAdminRights"
                class="q-pr-sm"
                :val="row._id"
                label="Админ"
                @update:model-value="onUpdateRoles"
              />
            </div>
          </QTd>
        </QTr>
      </template>
    </QTable>
  </QCard>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { IUser } from '@/types';
import { ref } from 'vue';
import { useFetch } from '@/hooks';
import { MessangerService } from '@/api/services';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';

const { currentChat } = storeToRefs(useChatStore());
const hasAdminRights = ref(currentChat.value?.group.roles.admin || []);
const { f: onUpdateRoles, loading } = useFetch({
  fn: () => MessangerService.updateRolesInGroup(currentChat.value!.group._id, 'admin', hasAdminRights.value),
  alert: true,
  successMsg: 'Обновлено',
});

const columns: QTable['columns'] = [
  {
    name: 'name',
    label: 'Имя',
    align: 'center',
    field: 'name',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
    sort: (a, b) => a.localeCompare(b),
  },
  {
    name: 'login',
    label: 'Логин',
    align: 'center',
    field: 'login',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
    sort: (a, b) => a.localeCompare(b),
  },
  { name: 'roles', label: 'Роль', align: 'center', field: 'roles', headerStyle: 'font-size: 1.1em;' },
];
</script>

<style module lang="scss">
.container {
  min-width: 300px;
  max-width: 500px;
  width: 500px;
}
</style>
