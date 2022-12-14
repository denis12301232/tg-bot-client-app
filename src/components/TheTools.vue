<template lang="pug">
v-btn(class="home_button", @click="$router.push('/')") На главную
div(class="tools")
   h1(class="title") Инструменты
   ul(class="tools_list")
      li(class="list_item")
         h3(:class="['item_title', tools.integrate ? 'selected' : '']", @click="setVisible('integrate')") Настроить интеграцию с Google
         TheToolsGoogle(v-show="tools.integrate")
      li(class="list_item")
         h3(:class="['item_title', tools.sheets ? 'selected' : '']", @click="setVisible('sheets')") Выгрузить заявки в Google Sheets
         TheToolsSheetsVue(v-show="tools.sheets")
      li(class="list_item")
         h3(:class="['item_title', tools.adminRights ? 'selected' : '']", @click="setVisible('adminRights')") Настроить роли пользователей
         TheToolsRoles(v-if="tools.adminRights")
</template>
   
<script setup lang="ts">
import { reactive } from 'vue'
import TheToolsGoogle from '@/components/TheToolsGoogle.vue'
import TheToolsSheetsVue from '@/components/TheToolsSheets.vue'
import TheToolsRoles from '@/components/TheToolsRoles.vue'

const tools = reactive({
   integrate: false,
   sheets: false,
   adminRights: false,
});

function setVisible(key: keyof typeof tools): void {
   Object.keys(tools).forEach((item) => {
      const value = item as keyof typeof tools;
      if (tools[value] === tools[key]) return;
      tools[value] = false;
   });
   tools[key] = !tools[key];
}
</script>
   
<style lang="scss" scoped>
.home_button {
   margin: 10px 0px 0px 10px;
}

.tools {
   margin: 0 auto;
   width: 90%;

   & .title {
      padding: 20px 0;
   }

   & .tools_list {
      padding-bottom: 5px;
      width: 50%;

      & .list_item {
         & .item_title {
            user-select: none;

            &:hover {
               cursor: pointer;
               color: teal;
            }
         }
      }
   }
}

.selected {
   color: teal;
}

@media (max-width:768px) {
   .tools{
      & .tools_list{
         width: 100%;
      }
   }
}
</style>