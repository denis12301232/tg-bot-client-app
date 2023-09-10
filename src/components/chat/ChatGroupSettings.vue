<template>
  <QDialog v-model="modal">
    <GroupRoles />
  </QDialog>
  <QCard>
    <QCardSection class="row justify-end">
      <QBtn v-close-popup icon="eva-close" round dense flat color="negative" />
    </QCardSection>
    <QCardSection class="row column items-center">
      <GroupUpdate />
    </QCardSection>
    <QCardSection>
      <div class="row justify-center">
        <QBtn color="teal" @click="openModal">{{ t('chat.groupSettings.form.buttons.roles') }}</QBtn>
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import { GroupUpdate, GroupRoles } from '@/components/chat';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const modal = ref(false);

function openModal() {
  modal.value = true;
}
</script>
@/components/chats
