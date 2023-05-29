<template>
  <div class="column items-center q-pa-sm">
    <QDialog v-model="modal" no-route-dismiss @before-hide="$router.push('/')">
      <component :is="modalComponent" @close="onClose" />
    </QDialog>
    <FormAssistance
      title="Заявка на получение гуманитарной помощи"
      :form="form"
      :loading="loading"
      reset
      @submit="request"
    >
      <template #submit="{ type, valid }">
        <QBtn :type="type" :loading="loading" :disable="!valid" color="red-10" label="Отправить" />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import type { AssistanceResponse } from '@/types';
import FormAssistance from '~/FormAssistance.vue';
import FormReg from '~/FormReg.vue';
import FormLog from '~/FormLog.vue';
import { ref, watch, shallowRef, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { useStore } from '@/stores';

type T = AssistanceResponse;
type S = typeof AssistanceService['saveForm'];

const store = useStore();
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
  afterResponse: ({ response }) => {
    response.status === 200
      ? store.setAlert(true, { message: 'Заявка отправлена!' })
      : store.setAlert(true, { message: 'Ошибка! Попробуйте позже...', type: 'error' });
  },
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
