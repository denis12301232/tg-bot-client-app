<template>
  <div class="column items-center q-pa-sm">
    <component :is="component" />
  </div>
</template>

<script setup lang="ts">
import { RestorePassword, SetPassword } from '~/restore';
import { type Component, shallowRef, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const name = computed(() => (route.query.link ? 'setPassword' : 'restorePassword'));
const component = shallowRef<Component>(RestorePassword);

watch(
  name,
  () => {
    switch (name.value) {
      case 'restorePassword':
        return (component.value = RestorePassword);
      case 'setPassword':
        return (component.value = SetPassword);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" module></style>
