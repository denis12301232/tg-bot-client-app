<template>
  <div class="column items-center q-pa-sm">
    <FormAssistance
      v-model="form"
      :class="$style.form"
      :title="t('home.form.title')"
      :loading="loading"
      reset
      @submit="query(form)"
    >
      <template #submit="{ type, valid }">
        <QBtn
          :type="type"
          :loading="loading"
          :disable="!valid"
          color="primary"
          :label="t('home.form.buttons.submit')"
        />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import FormAssistance from '~/FormAssistance.vue';
import { ref } from 'vue';
import { useTelegram, useQuery } from '@/hooks';
import { AssistanceService, BotService } from '@/api/services';
import { useI18n } from 'vue-i18n';
import { useAlertStore } from '@/stores';

const alertStore = useAlertStore();
const { t } = useI18n();
const { tg, isOpenedFromTg } = useTelegram();
const form = ref({
  name: '',
  surname: '',
  patronymic: '',
  phone: '',
  birth: '',
  district: null,
  street: null,
  house: '',
  flat: null,
  peopleCount: 1,
  peopleFio: [],
  invalids: false,
  kids: false,
  kidsAge: [],
  food: false,
  water: false,
  medicines: false,
  medicinesInfo: '',
  hygiene: false,
  hygieneInfo: '',
  pampers: false,
  pampersInfo: '',
  extraInfo: '',
  personalDataAgreement: false,
  photoAgreement: false,
});
const { query, loading } = useQuery(AssistanceService.store, { onSuccess });

function onSuccess() {
  if (isOpenedFromTg) {
    BotService.assistance(tg.initDataUnsafe.query_id || '', t('home.messages.save'));
  } else {
    alertStore.addAlert('success', t('home.messages.save'));
  }
}
</script>

<style lang="scss" module>
.form {
  max-width: 750px;
  width: 100%;
}
</style>
