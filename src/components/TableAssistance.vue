<template lang="pug">
table(class="table")
   tbody
      tr(v-for="(key, value) in form")
         td {{ Constants.assistance[value].display }}
         td {{ useBeautifyValue(key) }}
</template>


<script setup lang="ts">
import { useBeautifyValue } from '@/hooks/useBeautifyValue'
import Constants from '@/libs/Constants'
import type { AssistanceForm } from '@/interfaces/interfaces'

defineProps({
   form: {
      type: Object as () => AssistanceForm,
      default: {}
   }
});

</script>


<style lang="scss" scoped>
.table {
   border-spacing: 3px;
   margin-top: 5px;
   background-color: inherit;
   border-collapse: collapse;
   border-radius: 10px;
   border-style: hidden;
   box-shadow: 0 0 0 1px #ccc;
   width: 100%;
   table-layout: fixed;

   & td,
   th {
      border: solid 1px #ccc;
      padding: 10px;
      border-radius: 10px;
      overflow: auto;
      word-wrap: break-word;
   }
}
</style>