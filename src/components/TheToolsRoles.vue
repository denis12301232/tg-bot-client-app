<template lang="pug">
div(class="loader", v-if="isLoading")
   LoadingWheel
   span 
div(class="content", v-else)
   v-text-field(label="Поиск", v-model="searchQuery", variant="outlined")
   table(class="user_list")
      tbody
         tr(class="list_header")
            th Имя
            th Е-мэйл
            th Роль
         tr(class="list_row", v-for="user in searchedUsers")
            td(class="row_item")  
               span {{user.name}}
                  v-tooltip(activator="parent", location="bottom") {{user.name}}
            td(class="row_item")  
               span {{user.email}}
                  v-tooltip(activator="parent", location="bottom") {{user.email}}
            td(class="") 
               div(class="roles")
                  CCheckbox(class="role_set",value="user", v-model="user.roles", :disabled="true")
                  label(class="role_name") Пользователь
               div(class="roles")
                  CCheckbox(class="role_set",value="admin", v-model="user.roles", @change="updateUserRoles(user._id, user.roles)")
                  label(class="role_name") Админ                  
   </template>
      
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useStore } from '@/store/mainStore'
import { useFetching } from '@/hooks/useFetching'
import ToolsService from '@/api/services/ToolsService'
import type { IUser } from '@/interfaces/interfaces'

const store = useStore();
const { fetchFunc: getUsers, data: users, isLoading } =
   useFetching<IUser[]>({ callback: async () => ToolsService.getUsers(store.user._id), alert: false });
const { fetchFunc: updateUserRoles } =
   useFetching({ callback: updateRoles, successMessage: 'Обновлено' });
const searchQuery = ref('');
const searchedUsers = computed(() => {
   return users.value?.filter((item: any) => {
      return item.email.toLowerCase().includes(searchQuery.value.toLowerCase())
         || item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
   });
});

onMounted(getUsers);

async function updateRoles(_id: string, roles: string[]) {
   if (store.alert.isVisible) store.showAlert(false);
   return ToolsService.updateRoles(_id, roles)
}
</script>
      
<style lang="scss" scoped>
.loader {
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   padding-top: 10px;
}

.content {
   width: 100%;
   padding-top: 10px;
   padding-bottom: 5px;

   & .search {
      min-width: 250px;
   }

   & .user_list {
      border-spacing: 3px;
      margin-top: 5px;
      background-color: inherit;
      border-collapse: collapse;
      border-radius: 2px;
      border-style: hidden;
      box-shadow: 0 0 0 1.5px #738095;
      width: 100%;
      table-layout: fixed;
      min-width: 250px;

      & td,
      th {
         border: solid 1px #ccc;
         padding: 10px;
         border-radius: 10px;
         overflow: auto;
         word-wrap: break-word;
      }

      & .list_row {
         & .row_item {
            vertical-align: middle;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

         }
      }
   }
}

.roles {
   display: flex;
   place-items: center;

   &>.role_name {
      flex-basis: 90%;
      display: block;
      min-width: 50px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
   }

   &>.role_set {
      flex-basis: 10%;
      min-width: 30px;
   }
}

@media (max-width: 768px) {

   .content,
   .loader {
      width: 100%;
      margin: 0 auto;
   }
}
</style>  