<template lang="pug">
TheError(v-if="!store.isAdmin", :code="403", message="Forbidden")
div(v-else)
   TheHeader
   div(class="content")
      HumansList
</template>

<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue"
import HumansList from "@/components/HumansList.vue"
import { useStore } from "@/store/main"
import TheError from "@/components/TheError.vue"

const store = useStore();
</script>

<style lang="scss" scoped>
.content {
   position: relative;
   top: 50px;
}
</style>