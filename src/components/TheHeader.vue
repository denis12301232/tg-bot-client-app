<template lang="pug">
ModalWindow(@hide="show", :show="isVisible")
   FormLog(v-if="isFormVisible", @swap="swap", @visible="hideWindow", @restore="$router.push('/restore')")
   FormReg(v-else, @swap="swap")
v-app-bar
   v-app-bar-nav-icon(@click="emit('show')")
      v-icon mdi-menu
   v-app-bar-title
      span(class="title") Kharkov Volontier
   v-app-bar-nav-icon(@click="changeTheme")
      v-icon mdi-brightness-6
   v-btn(v-if="!store.isAuth", @click="show") Вход
   v-menu(offset-y)
      template(#activator="{ props }")
         v-app-bar-nav-icon(v-if="store.isAuth" v-bind="props")
            v-icon mdi-account-circle
      MenuUser
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store/mainStore'
import FormReg from './FormReg.vue'
import FormLog from './FormLog.vue'
import ModalWindow from './UI/ModalWindow.vue'
import MenuUser from '@/components/MenuUser.vue'

const emit = defineEmits(['show', 'theme']);
const store = useStore();
const isVisible = ref(false);
const isFormVisible = ref(true);

function hideWindow(value: boolean) {
   isVisible.value = value;
}

function swap() {
   isFormVisible.value = !isFormVisible.value;
}

function show() {
   isVisible.value = !isVisible.value;
   isFormVisible.value = true;
}

function changeTheme() {
   emit('theme');
}
</script>
   
<style scoped lang="scss">
.router-link-active {
   color: teal !important;
}

@media (max-width:768px) {
   .title {
      display: none;
   }
}
</style>
   