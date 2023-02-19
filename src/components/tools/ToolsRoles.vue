<template lang="pug">
div(class="form")
   h5(class="title") Настроить роли пользователей
   QInput(v-model="search" outlined label="Поиск")
   QTable(
      :rows="searchedUsers"
      :columns="columns"
      class="table"
      binary-state-sort
      separator="cell"
      row-key="index"
      hide-pagination
      no-data-label="Список пуст"
      )
      template(#body="{ row }")
         QTr
            QTd(key="name") {{ row.name }}
            QTd(key="login") {{ row.login }}
            QTd(key="roles" auto-width)
               div
                  QOptionGroup( 
                     v-model="row.roles"
                     type="checkbox" 
                     :options="options" 
                     @update:model-value="onUpdateRoles(row._id, row.roles)"
                     )
   div(v-if="total > 1" class="row justify-center q-mt-md")
      QPagination(v-model="page" color="grey-8" :max="total" size="sm")
</template>

<script setup lang="ts">
import type { QTable } from 'quasar'
import type { IUser } from '@/types/interfaces'
import { ref, computed, watch } from 'vue'
import { useFetch } from '@/hooks'
import { ToolsService } from '@/api/services'


const limit = 10;
const search = ref('');
const page = ref(1);
const total = ref(0);
const users = ref<IUser[]>([]);

watch(page, async () => {
   const response = await ToolsService.getUsers(limit, page.value);
   total.value = Math.ceil(+response.headers['x-total-count']! / limit)
   users.value = response.data;
}, { immediate: true });

const { f: onUpdateRoles } = useFetch({
   fn: ToolsService.updateRoles,
   alert: true,
   successMsg: 'Обновлено'
});

const searchedUsers = computed(() => {
   return users.value?.filter((item) => {
      return item.login.toLowerCase().includes(search.value.toLowerCase())
         || item.name.toLowerCase().includes(search.value.toLowerCase());
   });
});

const options = [
   { label: 'Пользователь', value: 'user', disable: true },
   { label: 'Админ', value: 'admin' }
];

const columns: QTable['columns'] = [
   { name: 'name', label: 'Имя', align: 'left', field: 'name', sortable: true, sort: (a, b) => a.localeCompare(b) },
   { name: 'login', label: 'Логин', align: 'left', field: 'login', sortable: true, sort: (a, b) => a.localeCompare(b) },
   { name: 'roles', label: 'Роль', align: 'center', field: 'roles' },
];
</script>

<style scoped lang="scss">
.form {
   padding: 0 20px;

   & .title {
      margin: 20px 0 20px 0;
      text-align: center;
   }

   & .table {
      margin-top: 20px;
   }
}

@media (max-width:480px) {
   .form {
      padding: 0;
   }
}
</style>