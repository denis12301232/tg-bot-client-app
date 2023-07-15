<template>
  <div class="column items-center q-pa-sm">
    <component :is="component" />
  </div>
</template>

<script setup lang="ts">
import Restore from '~/restore';
import { type Component, shallowRef, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const name = computed(() => (route.query.link ? 'setnewpassord' : 'sendmail'));
const component = shallowRef<Component>(Restore.SendMail);

watch(
  name,
  () => {
    switch (name.value) {
      case 'sendmail':
        return (component.value = Restore.SendMail);
      case 'setnewpassord':
        return (component.value = Restore.SetNewPassword);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" module></style>
