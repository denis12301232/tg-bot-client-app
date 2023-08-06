<template>
  <div class="column items-center q-pa-sm">
    <QDialog v-model="modal" no-route-dismiss @before-hide="$router.push('/')">
      <component :is="component" @close="onClose" />
    </QDialog>
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
import type { AssistanceResponse } from '@/types';
import FormAssistance from '~/FormAssistance.vue';
import FormReg from '~/FormReg.vue';
import FormLog from '~/FormLog.vue';
import { ref, watch, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useTelegram } from '@/hooks';
import { AssistanceService, BotService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { tg, isOpenedFromTg } = useTelegram();
const router = useRouter();
const route = useRoute();
const modal = ref(false);
const component = shallowRef<typeof FormLog | typeof FormReg>(FormLog);
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
const { request, loading } = useFetch<AssistanceResponse, (typeof AssistanceService)['saveForm']>(
  AssistanceService.saveForm,
  {
    alert: true,
    successMsg: t('home.messages.save'),
    errorMsg: 'Error',
    afterResponse() {
      isOpenedFromTg && BotService.assistance(tg.initDataUnsafe.query_id || '', t('home.messages.save'));
    },
  }
);

watch(
  () => route.name,
  () => {
    if (route.name === 'login' || route.name === 'registration') {
      modal.value = true;
      route.name === 'login' ? (component.value = FormLog) : (component.value = FormReg);
    }
  },
  { immediate: true }
);

function onClose() {
  modal.value = false;
  router.push('/');
}
</script>

<style lang="scss" module>
.form {
  max-width: 750px;
  width: 100%;
}
</style>
