<template lang="pug">
div(class="test")
   div(style="position: relative; top: 50%")
      DatePicker(label="Дата рождения", v-model="test")
</template>

<script setup lang="ts">
import DatePicker from '@/components/DatePicker.vue';
import { ref } from 'vue';
const test = ref('')
</script>


<style lang="scss" scoped>
.test{
   height: 2000px;
}
</style>
