<template lang="pug">
div(class="loader", v-if="isLoading")
   LoadingWheel
   span 
div(class="content", v-else)
   VInput(class="search", placeholder="Поиск", v-model="searchQuery")
   table(class="user_list")
      tbody
         tr(class="list_header")
            th Имя
            th Е-мэйл
            th Роль
         tr(class="list_row", v-for="user in searchedUsers")
            td(class="row_item")  {{user.name}}
            td(class="row_item")  {{user.email}}
            td(class="row_item") 
               div(class="roles")
                  VCheckbox(class="role_set",value="user", v-model="user.roles", :disabled="true")
                  label(class="role_name") Пользователь
               div(class="roles")
                  VCheckbox(class="role_set",value="admin", v-model="user.roles", @change="updateRoles(user._id, user.roles)")
                  label(class="role_name") Админ            
</template>
   
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { IUser } from '@/intefaces/interfaces'
import ToolsService from '@/api/services/ToolsService'
import { useStore } from '@/store/mainStore'

const store = useStore();
const users = ref<IUser[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const searchQuery = ref('');
const searchedUsers = computed(() => {
   return users.value.filter((item) => {
      return item.email.toLowerCase().includes(searchQuery.value.toLowerCase())
         || item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
   });
})

onMounted(() => {
   isLoading.value = true;
   ToolsService.getUsers(store.user._id)
      .then((response) => {
         users.value = response.data;
      })
      .catch(e => errorMessage.value = e?.response?.data?.message)
      .finally(() => isLoading.value = false);
});

function updateRoles(_id: string, roles: string[]) {
   console.log(_id);
   ToolsService.updateRoles(_id, roles)
      .then((response) => console.log(response.data.message));
}
</script>
   
<style lang="scss" scoped>
.loader {
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 50%;
}

.content {
   width: 50%;
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
      box-shadow: 0 0 0 1px #ccc;
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

            & .roles {
               display: flex;
               place-items: center;

               &>.role_name {
                  flex-basis: 90%;
                  display: block;
                  min-width: 50px;
               }

               &>.role_set {
                  flex-basis: 10%;
                  min-width: 30px;
               }
            }
         }
      }
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