<template>
  <QDialog v-model="modal">
    <MessangerGroupRoles />
  </QDialog>
  <QCard>
    <QCardSection class="row justify-end">
      <QBtn v-close-popup icon="close" round dense flat color="negative" />
    </QCardSection>
    <QCardSection class="row column items-center">
      <MessangerGroupUpdate />
    </QCardSection>
    <QCardSection>
      <div class="row justify-center">
        <QBtn color="teal" @click="openModal">Настроить роли</QBtn>
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import { MessangerGroupUpdate, MessangerGroupRoles } from '~/messanger';
import { ref } from 'vue';

const modal = ref(false);

function openModal() {
  modal.value = true;
}
</script>
