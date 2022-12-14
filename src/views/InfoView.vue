<template lang="pug">
TheError(v-if="!store.isAdmin", :code="403", message="Forbidden")
div(v-else)
   TheHeader(@show="store.setMenuVisible", @theme="store.setTheme")
   TheHeaderMenu
   div(class="content")
      HumanInfo
</template>

<script setup lang="ts">
import { useStore } from '@/store/mainStore'
import TheHeader from '@/components/TheHeader.vue'
import HumanInfo from '@/components/HumanInfo.vue'
import TheError from '@/components/TheError.vue'
import TheHeaderMenu from '@/components/TheHeaderMenu.vue'

const store = useStore();
</script>

<style lang="scss" scoped>
</style>