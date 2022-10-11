<template lang="pug">
v-button(class="home_button", @click="$router.push('/')") На главную
div(class="container")
   ul(class="tools")
      h1(class="tools_title") Инструменты
      li(class="tools_item")
         div(class="item_title", @click="setVisible('integrate')") Настроить интеграцию с Google Sheets
         form(class="item_form", v-if="tools.integrate", @submit.prevent="setGoogleApi")
            div(class="form_title") Service account email
            v-input(class="tools_input", v-model="googleApi.serviceUser", placeholder="email")
            div(class="form_title") Service account private key
            v-input(class="tools_input", v-model="googleApi.servicePrivateKey", placeholder="key")
            div(class="form_title") Sheet ID
            v-input(class="tools_input", v-model="googleApi.sheetId", placeholder="id")
            div(class="buttons")
               v-button(
                  type="submit"
                  :disabled="!googleApi.serviceUser || !googleApi.servicePrivateKey || !googleApi.sheetId"
                  ) Сохранить
               v-loading-wheel(v-if="googleApi.isLoading")
               div(class="message") {{ googleApi.message }}
      li(class="tools_item")
         div(class="item_title", @click="setVisible('sheets')") Выгрузить заявки в Google Sheets
         ul(class="item_sheets", v-if="tools.sheets")
            v-select(class="sheets_select", :options="selectOptions", title="Выберите вариант", v-model="selected")
            li(class="sheets_block", v-if="selected === 'all'")
               div(class="buttons")
                  v-button(
                     @click="saveFormsToSheet(formsQueries.all)",
                     :disabled="isFormsLoading"
                     ) Сформировать
                  v-loading-wheel(v-if="formsQueries.all.isLoading")
                  div(class="message") {{ formsQueries.all.message }}
            li(class="sheets_block", v-if="selected === 'district'")
               v-select-district(v-model="formsQueries.district.query", :style="{ width: 'inherit' }")
               div(class="buttons")
                  v-button(
                     @click="saveFormsToSheet(formsQueries.district)",
                     :disabled="formsQueries.district.query === 'Район' || isFormsLoading"
                     ) Сформировать
                  v-loading-wheel(v-if="formsQueries.district.isLoading")
                  div(class="message") {{ formsQueries.district.message }}
            li(class="sheets_block", v-if="selected === 'birth'")
               div(class="block_year")
                  input(class="year_interval", v-model="min", type="number", placeholder="С")
                  input(class="year_interval", v-model="max", type="number", placeholder="По")
               div(class="buttons")
                  v-button(
                     @click="saveFormsToSheet(formsQueries.birth)",
                     :disabled="String(min).length < 4 || String(max).length < 4 || isFormsLoading"
                     ) Сформировать
                  v-loading-wheel(v-if="formsQueries.birth.isLoading")
                  div(class="message") {{ formsQueries.birth.message }}
            li(class="sheets_block", v-if="link")
               a(class="sheets_link", target="_blank", :href="link") Ссылка на выгруженные заявки
      li(class="tools_item")
         div(class="item_title", @click="setVisible('adminRights')") Дать/забрать права админа
         form(class="item_form", v-if="tools.adminRights")
            div(class="form_title") Email пользователя
            v-input(class="tools_input", v-model="adminRights.email", placeholder="email")
            div(class="buttons")
               v-button(
                  type="submit"
                  :disabled="!Validate.isEmail(adminRights.email) || !adminRights.email || adminRights.isLoading",
                  @click="giveAdminRights"
                  ) Дать права
               v-button(
                  type="submit"
                  :disabled="!Validate.isEmail(adminRights.email) || !adminRights.email || adminRights.isLoading",
                  @click="takeAdminRights"
                  ) Забрать
               v-loading-wheel(v-if="adminRights.isLoading")
            div(class="message") {{ adminRights.message }}
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import AssistanceService from '@/api/services/AssistanceService'
import ToolsService from '@/api/services/ToolsService'
import Validate from '@/libs/Validate'

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
   message: '',
   isLoading: false,
});

function setGoogleApi(): void {
   googleApi.isLoading = true;
   ToolsService.setGoogleServiceAccountSettings(googleApi.serviceUser, googleApi.servicePrivateKey, googleApi.sheetId)
      .then(response => {
         googleApi.message = response.data.message;
         googleApi.serviceUser = '';
         googleApi.servicePrivateKey = '';
         googleApi.sheetId = '';
      })
      .catch((e: any) => {
         googleApi.message = e?.response?.data?.message;
      })
      .finally(() => {
         googleApi.isLoading = false;
         setTimeout(() => googleApi.message = '', 3000);
      });
}

const selected = ref('');
const selectOptions = [
   { value: 'all', name: 'Выгрузить все' },
   { value: 'district', name: 'Выгрузить по району' },
   { value: 'birth', name: 'Выгрузить по году' }
];

const min = ref('');
const max = ref('');

watch([min, max], () => {
   if (String(min.value).length > 4) {
      min.value = String(min.value).slice(0, 4);
   };
   if (String(max.value).length > 4) {
      max.value = String(max.value).slice(0, 4);
   };
});
const isFormsLoading = ref(false);
const formsQueries = reactive({
   all: {
      filter: 'all',
      query: 'all',
      isLoading: false,
      message: '',
   },
   district: {
      filter: 'district',
      query: 'Район',
      isLoading: false,
      message: '',
   },
   birth: {
      filter: 'birth',
      query: computed(() => min.value + '-' + max.value),
      isLoading: false,
      message: '',
   }
});
const link = ref('');

function saveFormsToSheet(opts: typeof formsQueries.all): void {
   link.value = '';
   opts.isLoading = true;
   isFormsLoading.value = true;
   AssistanceService.saveFormsToSheet(opts.filter, opts.query)
      .then((response) => {
         opts.message = response.data.message;
         link.value = response.data.link;
      })
      .catch((e: any) => {
         opts.message = e.response.data.message;
      })
      .finally(() => {
         isFormsLoading.value = false;
         opts.isLoading = false;
         setTimeout(() => opts.message = '', 2000);
      });
}

const adminRights = reactive({
   email: '',
   isLoading: false,
   message: '',
});

function giveAdminRights(): void {
   adminRights.isLoading = true;
   adminRights.message = '';
   ToolsService.giveAdminRights(adminRights.email)
      .then((response) => {
         adminRights.message = response.data.message;
      })
      .catch((e: any) => {
         adminRights.message = e.response.data.message;
      })
      .finally(() => {
         adminRights.isLoading = false;
      });
}

function takeAdminRights(): void {
   adminRights.isLoading = true;
   adminRights.message = '';
   ToolsService.takeAdminRights(adminRights.email)
      .then((response) => {
         adminRights.message = response.data.message;
      })
      .catch((e: any) => {
         adminRights.message = e.response.data.message;
      })
      .finally(() => {
         adminRights.isLoading = false;
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
                     display: inline-block;
                     border: none;
                     border-bottom: 1px solid black;
                     -webkit-appearance: none;
                     -moz-appearance: textfield;
                     appearance: none;
                     outline: none;
                     padding: 5px 0;
                     width: 155px;

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