<template>
  <div class="column items-center q-pa-sm">
    <QDialog v-model="modal" no-route-dismiss @before-hide="$router.push('/')">
      <component :is="modalComponent" @close="onClose" />
    </QDialog>
    <FormAssistance
      :class="$style.form"
      :title="t('home.form.title')"
      :form="form"
      :loading="loading"
      reset
      @submit="request"
    >
      <template #submit="{ type, valid }">
        <QBtn :type="type" :loading="loading" :disable="!valid" color="primary" :label="t('home.form.buttons.submit')" />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import type { AssistanceResponse, I18n, Langs } from '@/types';
import FormAssistance from '~/FormAssistance.vue';
import FormReg from '~/FormReg.vue';
import FormLog from '~/FormLog.vue';
import { ref, watch, shallowRef, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { useI18n } from 'vue-i18n';

type T = AssistanceResponse;
type S = typeof AssistanceService['saveForm'];

const { t } = useI18n<I18n, Langs>();
const router = useRouter();
const route = useRoute();
const modal = ref(false);
const modalComponent = shallowRef<typeof FormLog | typeof FormReg>(FormLog);
const form = reactive({
  name: '',
  surname: '',
  patronymic: '',
  phone: '',
  birth: '',
  district: '',
  street: '',
  house: '',
  flat: '',
  people_num: 1,
  people_fio: [],
  invalids: false,
  kids: false,
  kids_age: [],
  food: false,
  water: false,
  medicines: false,
  medicines_info: '',
  hygiene: false,
  hygiene_info: '',
  pampers: false,
  pampers_info: '',
  diet: '',
  pers_data_agreement: false,
  photo_agreement: false,
});
const { request, loading } = useFetch<T, S>(AssistanceService.saveForm, {
  alert: true,
  successMsg: t('home.msgs.save'),
  errorMsg: 'Error'
});

watch(
  () => route.name,
  () => {
    if (route.name === 'login' || route.name === 'registration') {
      modal.value = true;
      route.name === 'login' ? (modalComponent.value = FormLog) : (modalComponent.value = FormReg);
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
