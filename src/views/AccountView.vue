<template lang="pug">
TheError(v-if="!store.user.email", :code="403", message="Forbidden")
TheAccount(v-else)
</template>

<script setup lang="ts">
import { useStore } from '@/store/mainStore'
import TheError from '@/components/TheError.vue'
import TheAccount from '@/components/TheAccount.vue'

const store = useStore();
</script>

<style lang="scss" module>
</style>