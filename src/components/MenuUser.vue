<template lang="pug">
v-list
   v-list-item(@click="router.push('/account')")
      a(href="/account", @click.prevent="", class="link") Аккаунт
   v-list-item(@click="router.push('/tools')")
      a(href="/tools", @click.prevent="", class="link") Инструменты
   v-list-item(@click="logout") Выйти
</template>

<script setup lang="ts">
import AuthController from '@/api/controllers/AuthController'
import { useRouter } from 'vue-router'

const emit = defineEmits<{ (e: 'loading', value: boolean): void }>();
const router = useRouter();

async function logout(): Promise<void> {
   emit('loading', true);
   await AuthController.logout();
   emit('loading', false);
   router.push('/');
}
</script>

<style lang="scss">
.link{
   text-decoration: none;
}
</style>