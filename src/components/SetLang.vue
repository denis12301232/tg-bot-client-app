<template>
  <QSelect
    v-model="store.lang"
    class="text-indigo"
    :options="options"
    rounded
    dense
    standout
    emit-value
    map-options
    options-dense
    hide-dropdown-icon
    hide-bottom-space
    hide-hint
    bg-color="indigo"
    label-color="white"
    input-class="text-white"
  >
    <template #selected>
      <div class="text-white text-uppercase">{{ store.lang }}</div>
    </template>
  </QSelect>
</template>

<script setup lang="ts">
import { useStore } from '@/stores';

const store = useStore();
const options = [
  { value: 'ru', label: 'RU' },
  { value: 'ua', label: 'UA' },
  { value: 'en', label: 'EN' },
];
</script>
