<template>
  <QCard>
    <QCardSection class="text-center text-h6"> Набрать </QCardSection>
    <QCardActions align="between">
      <QBtn dense round flat color="positive" icon="call" @click="call" />
      <QSpinnerDots v-if="calling" size="2em" />
      <QBtn v-close-popup dense round flat color="negative" icon="call_end" />
    </QCardActions>
  </QCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const calling = ref(false);

function call() {
  calling.value = true;
}
</script>

<style module lang="scss"></style>
