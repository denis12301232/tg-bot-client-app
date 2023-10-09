<template>
  <template></template>
</template>

<script setup lang="ts">
import { useStore } from '@/stores';
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const { refresh } = useStore();
const router = useRouter();
const route = useRoute();
const accessToken = String(route.query.accessToken);
accessToken ? localStorage.setItem('token', accessToken) : router.push('/');

onMounted(() => refresh().then(() => router.push('/')));
</script>
