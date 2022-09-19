<template lang="pug">
TheHeader
div(class="content")
   v-assistance
</template>

<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import vAssistance from "@/components/v-assistance.vue"

</script>

<style lang="scss" scoped>
.content {
   top: 50px;
   position: relative;
}
</style>
