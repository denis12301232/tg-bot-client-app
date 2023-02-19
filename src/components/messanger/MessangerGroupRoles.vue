<template lang="pug">
QCard(:class="$style.container")
   QCardSection
      div(class="text-h4 q-mb-lg text-center") Настроить роли
      QTable(
         :columns="columns"
         :rows="chat.users"
         :loading="loading"
         hide-pagination
         binary-state-sort
         separator="cell"
         no-data-label="Ничего не найдено"
         flat
         bordered
      )
         template(#body="{ row }")
            QTr
               QTd(key="name") {{ row.name }}
               QTd(key="login") {{ row.login }}
               QTd(key="roles" auto-width)
                  div
                     QCheckbox(
                        v-model="hasAdminRights" 
                        style="padding-right: 10px;" 
                        :val="row._id" 
                        label="Админ" 
                        @update:model-value="onUpdateRoles"
                        )  
</template>


<script setup lang="ts">
import type { QTable } from 'quasar'
import type { ChatResponse } from '@/types/http'
import { ref } from 'vue'
import { useFetch } from '@/hooks'
import { MessangerService } from '@/api/services'


const props = defineProps<{
   chat: ChatResponse;
}>();

const hasAdminRights = ref(props.chat.group.roles?.admin || []);
const { f: onUpdateRoles, loading } = useFetch({
   fn: () => MessangerService.updateRolesInGroup(props.chat.group._id, 'admin', hasAdminRights.value),
   alert: true,
   successMsg: 'Обновлено'
});

const columns: QTable['columns'] = [
   { name: 'name', label: 'Имя', align: 'left', field: 'name', sortable: true, sort: (a, b) => a.localeCompare(b) },
   { name: 'login', label: 'Логин', align: 'left', field: 'login', sortable: true, sort: (a, b) => a.localeCompare(b) },
   { name: 'roles', label: 'Роль', align: 'center', field: 'roles' },
];
</script>


<style module lang="scss">
.container {
   min-width: 300px;
   max-width: 500px;
   width: 500px;
   padding: 10px 10px 10px 10px;
}
</style>