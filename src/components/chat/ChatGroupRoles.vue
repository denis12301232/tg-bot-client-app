<template>
  <QCard :class="$style.container">
    <QTable
      :columns="columns"
      :rows="currentChat?.users"
      :loading="loading"
      :rows-per-page-options="[5, 10]"
      :pagination-label="(f, l, a) => `${f}-${l} ${t('table.of')} ${a}`"
      :loading-label="t('table.loading')"
      :no-data-label="t('table.noData')"
      :rows-per-page-label="t('table.show')"
      :no-results-label="t('table.notFound')"
      :selected-rows-label="(n) => `${t('table.selected')} ${n}`"
      binary-state-sort
      separator="cell"
      bordered
    >
      <template #header>
        <QTr>
          <QTh colspan="3">
            <h6 class="q-py-sm">{{ t('chat.groupSettings.roles.table.title') }}</h6>
          </QTh>
        </QTr>
      </template>
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
                :label="t('chat.groupSettings.roles.table.checkboxes.admin')"
                @update:model-value="request(currentChat!.group._id, 'admin', hasAdminRights)"
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
import { useFetch, useI18nT } from '@/hooks';
import { ChatService } from '@/api/services';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores';

const { t } = useI18nT();
const { currentChat } = storeToRefs(useChatStore());
const hasAdminRights = ref(currentChat.value?.group.roles.admin || []);
const { request, loading } = useFetch(ChatService.updateRolesInGroup, {
  alert: true,
  successMsg: t('chat.groupSettings.msgs.updatedRoles'),
  errorMsg: t('chat.groupSettings.msgs.updatedRolesFailed'),
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
