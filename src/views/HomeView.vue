<template>
  <div class="column items-center q-pa-sm">
    <FormAssistance
      v-model="form"
      :class="$style.form"
      :title="t('home.form.title')"
      :loading="loading"
      reset
      @submit="request(form)"
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
import type { Responses } from '@/types';
import FormAssistance from '~/FormAssistance.vue';
import { ref } from 'vue';
import { useFetch, useTelegram } from '@/hooks';
import { AssistanceService, BotService } from '@/api/services';
import { useI18n } from 'vue-i18n';

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
const { request, loading } = useFetch<Responses.Assistance, typeof AssistanceService.store>(
  AssistanceService.store,
  {
    alert: true,
    successMsg: t('home.messages.save'),
    errorMsg: 'Error',
    afterResponse() {
      isOpenedFromTg && BotService.assistance(tg.initDataUnsafe.query_id || '', t('home.messages.save'));
    },
  }
);
</script>

<style lang="scss" module>
.form {
  max-width: 750px;
  width: 100%;
}
</style>
