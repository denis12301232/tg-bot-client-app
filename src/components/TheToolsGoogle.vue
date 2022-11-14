<template lang="pug">
form(class="google", @submit.prevent="setGoogleApi")
   div(class="google_title") Service account email
   VInput(class="google_input", v-model="googleApi.serviceUser", placeholder="email")
   div(class="google_title") Service account private key
   VInput(class="google_input", v-model="googleApi.servicePrivateKey", placeholder="key")
   div(class="google_title") Sheet ID
   VInput(class="google_input", v-model="googleApi.sheetId", placeholder="sheet id")
   div(class="google_title") Folder ID
   VInput(class="google_input", v-model="googleApi.folderId", placeholder="folder id")
   div(class="google_control")
      VButton(type="submit", :disabled="isDisabled") Сохранить
      LoadingWheel(v-if="googleApi.isLoading")
      div(class="google_message") {{googleApi.message}}
</template>
   
<script setup lang="ts">
import ToolsService from '@/api/services/ToolsService'
import { reactive, computed } from 'vue'
import { useStore } from '@/store/mainStore'

const store = useStore();
const googleApi = reactive({
   serviceUser: '',
   servicePrivateKey: '',
   sheetId: '',
   folderId: '',
   message: '',
   isLoading: false,
});

const isDisabled = computed(() => {
   return !googleApi.serviceUser && !googleApi.servicePrivateKey && !googleApi.sheetId && !googleApi.folderId;
});


function setGoogleApi(): void {
   googleApi.isLoading = true;
   ToolsService.setGoogleServiceAccountSettings(
      googleApi.serviceUser, googleApi.servicePrivateKey, googleApi.sheetId, googleApi.folderId
   )
      .then(response => {
         googleApi.serviceUser = '';
         googleApi.servicePrivateKey = '';
         googleApi.sheetId = '';
         googleApi.folderId = '';
         store.setAlert('success', response.data.message);
      })
      .catch((e: any) => {
         store.setAlert('error', e?.response?.data?.message);
      })
      .finally(() => {
         googleApi.isLoading = false;
         store.showAlert();
      });
}
</script>
   
<style lang="scss" scoped>
.google {
   &>* {
      margin-top: 5px;
   }

   & .google_title {
      color: var(--water-color);
      font-weight: 600;
   }

   & .google_input {
      width: 30%;
      min-width: 250px;
   }

   & .google_control {
      display: flex;
      place-items: center;
   }

   & .google_message {
      color: rgb(23, 122, 23);
      padding: 0 5px;
   }
}

// .home_button {
//    margin: 10px 0px 0px 10px;
// }

// .container {
//    margin: 0 auto;
//    width: 90%;

//    & .tools {
//       & .tools_item {

//          & .tools_input {
//             width: 30%;
//             min-width: 250px;
//          }

//          & .item_title {
//             color: #738095;
//             font-weight: bold;
//             font-size: 1.2em;
//             cursor: pointer;
//             user-select: none;
//             display: inline-block;

//             &:hover {
//                color: green;
//             }
//          }

//          & .message {
//             color: rgb(32, 143, 71);
//             font-weight: bold;
//          }

//          & .buttons {
//             display: flex;
//             align-items: center;

//             &>*:not(:first-child) {
//                margin-left: 5px;
//             }
//          }

//          & .item_form {

//             &>* {
//                margin-top: 5px;
//             }

//             & .form_title {
//                color: var(--water-color);
//                font-weight: 600;
//             }
//          }

//          & .item_sheets {

//             & .sheets_select {
//                margin-top: 5px;
//                margin-bottom: 5px;
//                min-width: 250px;
//             }

//             & .sheets_block {
//                padding: 5px 0 0;

//                & .sheets_link {
//                   display: inline-block;
//                   color: rgb(32, 143, 71);
//                   text-decoration: none;
//                   font-weight: bolder;
//                   cursor: pointer;
//                   margin-bottom: 20px;

//                   &:visited {
//                      color: rgb(32, 143, 71);
//                   }

//                   &:hover,
//                   &:focus {
//                      color: #C4433A;
//                      border-bottom: 1px solid;
//                   }
//                }

//                & .block_year {
//                   display: flex;
//                   flex-direction: column;

//                   & .year_interval {
//                      width: 250px;
//                      margin-bottom: 5px;

//                      &:focus {
//                         border-bottom: 1px solid #1a73a8 !important;
//                      }

//                      &::-webkit-outer-spin-button,
//                      &::-webkit-inner-spin-button {
//                         -webkit-appearance: none;
//                         appearance: none;
//                      }
//                   }
//                }
//             }
//          }
//       }
//    }
// }

// @media(max-width:768px) {
//    .container {
//       & h1 {
//          text-align: center;
//       }
//    }
// }
</style>