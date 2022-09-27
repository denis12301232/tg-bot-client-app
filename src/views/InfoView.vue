<template lang="pug">
TheError(v-if="!store.isAdmin", :code="403", message="Forbidden")
div(v-else)
   TheHeader
   div(class="content")
      HumanInfo
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import HumanInfo from '@/components/HumanInfo.vue'
import TheError from '@/components/TheError.vue'
import { useStore } from '@/store/main'

const store = useStore();
</script>

<style lang="scss" scoped>
.content {
   top: 50px;
   position: relative;
}
</style>