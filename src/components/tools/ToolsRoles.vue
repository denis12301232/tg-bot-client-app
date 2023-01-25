<template lang="pug">
div(class="form")
   h5(class="title") Настроить роли пользователей
   QInput(v-model="search" outlined label="Поиск")
   QMarkupTable(separator="cell")
      thead
         tr
            th Имя
            th Логин
            th Роль
      tbody
         tr(v-for="user in searchedUsers")
            td {{ user.name }}
            td {{ user.login }}
            td 
               QOptionGroup(
                  v-model="user.roles" 
                  type="checkbox" 
                  :options="options" 
                  @update:model-value="onUpdateRoles(user._id, user.roles)"
                  )
</template>

<script setup lang="ts">
import type { IUser } from '@/types/interfaces'
import { ref, computed, onMounted, watch } from 'vue'
import { useFetch } from '@/hooks'
import { ToolsService } from '@/api/services'


const search = ref('');
const { f: getUsers, loading, data: users } = useFetch<IUser[]>({
   fn: ToolsService.getUsers,
});
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
onMounted(getUsers);

const options = [
   { label: 'Пользователь', value: 'user', disable: true },
   { label: 'Админ', value: 'admin' }
];
</script>

<style scoped lang="scss">
.form {
   & .title {
      margin: 20px 0 10px 0;
   }
}
</style>