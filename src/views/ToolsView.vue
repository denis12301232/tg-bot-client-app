<template lang="pug">
TheError(v-if="!store.isAdmin", :code="403", message="Forbidden")
TheTools(v-else)
</template>

<script setup lang="ts">
import { useStore } from '@/store/mainStore'
import TheError from '@/components/TheError.vue'
import TheTools from '@/components/TheTools.vue'

const store = useStore();
</script>

<style lang="scss" module>
</style>