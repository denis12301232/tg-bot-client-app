<template lang="pug">
v-button(:class="$style.home_button", @click="$router.push('/')") На главную
div(:class="$style.account")
   h1 Настройки аккаунта
   ul(:class="$style.tools")
      li(:class="$style.tools_list")
         div(:class="$style.list_title") Имя пользователя
         div(:class="$style.list_block")
            v-input(
               :class="$style.list_input", 
               placeholder="Имя пользователя", 
               type="text", 
               :value="tools.name.value",
               @input="tools.name.input.call(tools.name, $event)"
               )
            div(:class="$style.list_buttons")
               v-button-confirm(v-if="tools.name.value !== store.user.name", @click="setNewName")
               v-button-cancel(v-if="tools.name.value !== store.user.name", @click="tools.name.cancel.call(tools.name)")
               v-loading-wheel(v-if="tools.name.isLoading")
         div(:class="$style.list_message")
            small(:class="$style.list_error") {{ tools.name.errorMessage }}
            small(:class="$style.list_ok") {{ tools.name.okMessage }}
      li(:class="$style.tools_list")
         div(:class="$style.list_title") Адрес электронной почты
         div(:class="$style.list_block")
            v-input(
               :class="$style.list_input", 
               placeholder="Е-мэйл", 
               type="email", 
               :value="tools.email.value", 
               @input="tools.email.input.call(tools.email, $event)"
               )
            div(:class="$style.list_buttons")
               v-button-confirm(v-if="tools.email.value !== store.user.email", @click="setNewEmail")
               v-button-cancel(v-if="tools.email.value !== store.user.email", @click="tools.email.cancel.call(tools.email)")
               v-loading-wheel(v-if="tools.email.isLoading")
         div(:class="$style.list_message")
            small(:class="$style.list_error") {{ tools.email.errorMessage }}
            small(:class="$style.list_ok") {{ tools.email.okMessage }}
      li(:class="$style.tools_list")
         div(:class="$style.list_title") Пароль
         div(:class="$style.list_fields")
            v-input(
               :class="$style.list_input",
               placeholder="Старый пароль",
               type="password",
               v-model="tools.password.old",
               autocomplete="new-password"
               )
            v-input(
               :class="$style.list_input",
               placeholder="Новый пароль", 
               type="password",
               v-model="tools.password.new",
               autocomplete="new-password"
               )
         div(:class="$style.list_block")
            v-button(@click="setNewPassword", :disabled="!(tools.password.old.length >= 6) || !(tools.password.new.length >= 6)") Изменить
            v-loading-wheel(v-if="tools.password.isLoading")
            div(:class="$style.list_message")
               small(:class="$style.list_error") {{ tools.password.errorMessage }}
               small(:class="$style.list_ok") {{ tools.password.okMessage }}
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useStore } from '@/store/mainStore'
import ToolsService from '@/api/services/ToolsService'
import Validate from '@/libs/Validate'

const store = useStore();
const tools = reactive({
   name: {
      value: store.user.name,
      hidden: true,
      isLoading: false,
      errorMessage: '',
      okMessage: '',
      input(event: Event): void {
         const target = event.target as HTMLInputElement;
         this.value = target.value;
         !Validate.required(this.value) ? this.errorMessage = '! Ввведите имя' : this.errorMessage = '';
      },
      cancel(): void {
         this.value = store.user.name;
         this.errorMessage = '';
      },
   },
   email: {
      value: store.user.email,
      hidden: true,
      isLoading: false,
      errorMessage: '',
      okMessage: '',
      input(event: Event): void {
         const target = event.target as HTMLInputElement;
         this.value = target.value;
         !Validate.isEmail(this.value) ? this.errorMessage = '! Ввведите корректный е-мэйл' : this.errorMessage = '';
      },
      cancel(): void {
         this.value = store.user.email;
         this.errorMessage = '';
      },
   },
   password: {
      old: '',
      new: '',
      hidden: true,
      isLoading: false,
      errorMessage: '',
      okMessage: '',
   }
});

async function setNewName(): Promise<void> {
   try {
      tools.name.isLoading = true;
      await ToolsService.setNewName(tools.name.value);
      store.user.name = tools.name.value;
      tools.name.okMessage = `Имя изменено на ${store.user.name}`;
   } catch (e: any) {
      tools.name.errorMessage = e?.response?.data?.message;
      console.log(e);
   } finally {
      tools.name.isLoading = false;
      setTimeout(() => {
         tools.name.okMessage = '';
         tools.name.errorMessage = '';
      }, 2000);
   }
}

async function setNewEmail(): Promise<void> {
   try {
      tools.email.isLoading = true;
      await ToolsService.setNewEmail(tools.email.value);
      store.user.email = tools.email.value;
      tools.email.okMessage = `Е-мэйл изменен на ${store.user.email}`;
   } catch (e: any) {
      tools.email.errorMessage = e?.response?.data?.message;
      console.log(e);
   } finally {
      tools.email.isLoading = false;
      setTimeout(() => {
         tools.email.okMessage = '';
         tools.email.errorMessage = '';
      }, 2000);
   }
}

async function setNewPassword(): Promise<void> {
   try {
      tools.password.isLoading = true;
      await ToolsService.setNewPassword(tools.password.new, tools.password.old);
      tools.password.okMessage = `Пароль изменен!`;
      tools.password.old = '';
      tools.password.new = '';
   } catch (e: any) {
      tools.password.errorMessage = e?.response?.data?.message;
      console.log(e);
   } finally {
      tools.password.isLoading = false;
      setTimeout(() => {
         tools.password.okMessage = '';
         tools.password.errorMessage = '';
      }, 2000);
   }
}
</script>

<style lang="scss" module>
.home_button {
   margin: 10px 0px 0px 10px;
}

.account {
   margin: 0 auto;
   width: 90%;

   & .tools {
      & .tools_list {
         padding-bottom: 10px;

         & .list_message {
            height: 1em;
            font-weight: bold;

            & .list_error,
            & .list_ok {
               display: table-cell;
               vertical-align: middle;
            }

            & .list_error {
               color: var(--error-message-color);
            }

            & .list_ok {
               color: rgb(11, 93, 49);
            }
         }

         & .list_title {
            color: #475366;
            font-weight: 700;
         }

         & .list_block {
            display: flex;
            flex-wrap: wrap;
            padding: 5px 0;
            align-items: center;
         }

         & .list_buttons {
            display: flex;
            align-items: center;
            padding: 3px;
            width: 100px;

            &>*:not(:first-child) {
               margin-left: 3px;
            }
         }

         & .list_input {
            width: 30%;
         }

         & .list_fields {
            display: flex;
            flex-direction: column;

            &>* {
               margin-top: 10px;
            }
         }
      }
   }
}

@media(max-width:768px) {
   .account {
      & h1 {
         text-align: center;
      }
   }
}
</style>