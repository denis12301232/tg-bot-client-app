<template>
  <QBtn color="primary" :label="selected" dense round flat>
    <QMenu fit anchor="bottom start" self="top start">
      <QList>
        <QItem
          v-for="lang in options"
          v-close-popup
          :key="lang.value"
          clickable
          class="q-pa-sm"
          active-class="text-primary"
          :active="lang.value === store.lang"
          @click="setLang(lang.value as Langs)"
        >
          <QItemSection>{{ lang.label }}</QItemSection>
        </QItem>
      </QList>
    </QMenu>
  </QBtn>
</template>

<script setup lang="ts">
import type { Langs } from '@/types';
import { computed } from 'vue';
import { useStore } from '@/stores';

const store = useStore();
const options = [
  { value: 'ru', label: 'RU' },
  { value: 'uk', label: 'UA' },
  { value: 'en', label: 'EN' },
];
const selected = computed(() => options.find((item) => item.value === store.lang)?.label);

function setLang(lang: Langs) {
  store.lang = lang;
}
</script>
