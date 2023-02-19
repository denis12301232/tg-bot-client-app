<template lang="pug">
div(class="container")
   h1 {{ code }}
   h2 {{ message }}
   QBtn(class="q-mt-md" color="primary" @click="$router.push('/')") На главную
</template>

<script setup lang="ts">

defineProps<{
   code: number;
   message: string;
}>();
</script>

<style lang="scss" scoped>
.container {
   height: 100vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
}
</style>