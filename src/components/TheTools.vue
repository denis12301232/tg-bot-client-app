<template lang="pug">
VButton(class="home_button", @click="$router.push('/')") На главную
div(class="container")
   ul(class="tools")
      h1(class="tools_title") Инструменты
      li(class="tools_item")
         div(class="item_title", @click="setVisible('integrate')") Настроить интеграцию с Google
         TheToolsGoogle(v-if="tools.integrate")
      li(class="tools_item")
         div(class="item_title", @click="setVisible('sheets')") Выгрузить заявки в Google Sheets
         ul(class="item_sheets", v-if="tools.sheets")
            CheckboxFilter(:filters="filtersOptions", @filtered="filtered")
            li(class="sheets_block", v-if="filter.includes('district')")
               VSelect(
                  class="sheets_select", 
                  v-model="selectedFilters.district", 
                  :options="Constants.districtOptions", 
                  title="Район"
                  )
            li(class="sheets_block", v-if="filter.includes('birth')")
               div(class="block_year")
                  VInput(class="year_interval", v-model="selectedFilters.birth.from", type="number", placeholder="С")
                  VInput(class="year_interval", v-model="selectedFilters.birth.to", type="number", placeholder="По")
            li(class="sheets_block", v-if="filter.length")
               div(class="buttons")
                  VButton(
                     @click="saveFormsToSheet", 
                     :disabled="isDisabled"
                     ) Сформировать
                  LoadingWheel(v-if="isLoading")
                  div(class="message") {{message}}
            li(class="sheets_block", v-if="link")
               a(class="sheets_link", target="_blank", :href="link") Ссылка на выгруженные заявки
      li(class="tools_item")
         div(class="item_title", @click="setVisible('adminRights')") Настроить роли пользователей
         form(class="item_form", v-if="tools.adminRights")
            UserList
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import AssistanceService from '@/api/services/AssistanceService'
import ToolsService from '@/api/services/ToolsService'
import Constants from '@/libs/Constants'
import CheckboxFilter from './CheckboxFilter.vue'
import UserList from './UserList.vue'
import TheToolsGoogle from './TheToolsGoogle.vue'

const filter = ref<string[]>([]);
const filtersOptions = [
   { name: 'По району', value: 'district' },
   { name: 'По году', value: 'birth' },
];
const selectedFilters = reactive({
   district: '', birth: { from: '', to: '' }
});

function filtered(value: string[]) {
   filter.value = value;
   if (!filter.value.includes('district')) {
      selectedFilters.district = '';
   }
   if (!filter.value.includes('birth')) {
      selectedFilters.birth.from = '';
      selectedFilters.birth.to = '';
   }
}

const tools = reactive({
   integrate: false,
   sheets: false,
   adminRights: false,
});

function setVisible(key: keyof typeof tools): void {
   tools[key] = !tools[key];
}

const googleApi = reactive({
   serviceUser: '',
   servicePrivateKey: '',
   sheetId: '',
   folderId: '',
   message: '',
   isLoading: false,
});

const link = ref('');
const isLoading = ref(false);
const message = ref('');
const isDisabled = computed(() => {
   if (filter.value.includes('district') && filter.value.includes('birth')) {
      return isLoading.value || !selectedFilters.district || !selectedFilters.birth.to || !selectedFilters.birth.from;
   }
   return isLoading.value || !selectedFilters.district && (!selectedFilters.birth.to || !selectedFilters.birth.from);
})

function saveFormsToSheet(): void {
   link.value = '';
   isLoading.value = !isLoading.value;
   const filters = {
      district: selectedFilters.district,
      birth: { to: selectedFilters.birth.to || 9999, from: selectedFilters.birth.from || 0 }
   }
   AssistanceService.saveFormsToSheet(filters)
      .then((response) => {
         message.value = response.data.message;
         link.value = response.data.link;
      })
      .catch((e) => message.value = e?.response?.data?.message)
      .finally(() => {
         isLoading.value = false;
         setTimeout(() => message.value = '', 2000);
      });
} 
</script>

<style lang="scss" scoped>
.home_button {
   margin: 10px 0px 0px 10px;
}

.container {
   margin: 0 auto;
   width: 90%;

   & .tools {
      & .tools_item {

         & .tools_input {
            width: 30%;
            min-width: 250px;
         }

         & .item_title {
            color: #738095;
            font-weight: bold;
            font-size: 1.2em;
            cursor: pointer;
            user-select: none;
            display: inline-block;

            &:hover {
               color: green;
            }
         }

         & .message {
            color: rgb(32, 143, 71);
            font-weight: bold;
         }

         & .buttons {
            display: flex;
            align-items: center;

            &>*:not(:first-child) {
               margin-left: 5px;
            }
         }

         & .item_form {

            &>* {
               margin-top: 5px;
            }

            & .form_title {
               color: var(--water-color);
               font-weight: 600;
            }
         }

         & .item_sheets {

            & .sheets_select {
               margin-top: 5px;
               margin-bottom: 5px;
               min-width: 250px;
            }

            & .sheets_block {
               padding: 5px 0 0;

               & .sheets_link {
                  display: inline-block;
                  color: rgb(32, 143, 71);
                  text-decoration: none;
                  font-weight: bolder;
                  cursor: pointer;
                  margin-bottom: 20px;

                  &:visited {
                     color: rgb(32, 143, 71);
                  }

                  &:hover,
                  &:focus {
                     color: #C4433A;
                     border-bottom: 1px solid;
                  }
               }

               & .block_year {
                  display: flex;
                  flex-direction: column;

                  & .year_interval {
                     width: 250px;
                     margin-bottom: 5px;

                     &:focus {
                        border-bottom: 1px solid #1a73a8 !important;
                     }

                     &::-webkit-outer-spin-button,
                     &::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        appearance: none;
                     }
                  }
               }
            }
         }
      }
   }
}

@media(max-width:768px) {
   .container {
      & h1 {
         text-align: center;
      }
   }
}
</style>