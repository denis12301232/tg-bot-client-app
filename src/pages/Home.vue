<template>
  <div class="container">
    <QDialog v-model="loginModal">
      <QCard class="card">
        <component :is="component" @swap="onSwap" @submit="onOpenLogin" />
      </QCard>
    </QDialog>
    <FormAssistance
      title="Заявка на получение гуманитарной помощи"
      :form="form"
      :loading="loading"
      reset
      @submit="onSubmit"
    >
      <template #submit="{ type, valid }">
        <QBtn :type="type" :loading="loading" :disable="!valid" color="primary" label="Отправить" />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import FormAssistance from '~/FormAssistance.vue';
import FormReg from '~/FormReg.vue';
import FormLog from '~/FormLog.vue';
import { reactive, shallowRef, inject, type Ref } from 'vue';
import { useFetch, useTelegram } from '@/hooks';
import { AssistanceService } from '@/api/services';

const loginModal = inject<Ref<boolean>>('loginModal')!;
const component = shallowRef(FormLog);
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
const { tg, isOpenedFromTg } = useTelegram();
const { f: onSubmit, loading } = useFetch({ fn: submit, alert: true, successMsg: 'Сохранено' });

async function submit(form: any) {
  await AssistanceService.sendForm(form);
  if (isOpenedFromTg) {
    tg.sendData(JSON.stringify('Сохранено'));
  }
}

function onOpenLogin() {
  loginModal.value = !loginModal.value;
}

function onSwap(value: 'reg' | 'log') {
  switch (value) {
    case 'log':
      component.value = FormLog;
      break;
    case 'reg':
      component.value = FormReg;
      break;
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 0 20px 10px 20px;
}

.card {
  padding: 10px 20px 25px 20px;
  min-width: 300px;
  max-width: 400px;
  width: 100%;
}

@media (max-width: 480px) {
  .container {
    padding: 0 5px 5px 5px;
  }
}
</style>
