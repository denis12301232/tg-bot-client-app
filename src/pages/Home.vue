<template lang="pug">
div(class="container")
   QDialog(v-model="layoutStore.header.openLogin")
      QCard
         component(:is="component" @swap="onSwap" @submit="onOpenLogin")
   FormAssistance(:form="form" title="Заявка на получение гуманитарной помощи" :loading="loading" reset @submit="onSubmit")
      template(#submit="{ type, valid }")
         QBtn(:type="type" :loading="loading" :disable="!valid" color="primary") Отправить
</template>


<script setup lang="ts">
import FormAssistance from '~/FormAssistance.vue'
import FormReg from '~/FormReg.vue'
import FormLog from '~/FormLog.vue'
import { reactive, shallowRef } from 'vue'
import { useLayoutStore } from '@/stores'
import { useFetch, useTelegram } from '@/hooks'
import { AssistanceService } from '@/api/services'


const layoutStore = useLayoutStore();
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
   people_num: '',
   people_fio: [],
   invalids: 'Нет',
   kids: 'Нет',
   kids_age: [],
   food: 'Нет',
   water: 'Нет',
   medicines: 'Нет',
   medicines_info: '',
   hygiene: 'Нет',
   hygiene_info: '',
   pampers: 'Нет',
   pampers_info: '',
   diet: '',
   pers_data_agreement: false,
   photo_agreement: false,
});
const { tg, isOpenedFromTg } = useTelegram();
const { f: onSubmit, loading } = useFetch({
   fn: submit,
   alert: true,
   successMsg: 'Сохранено'
});

async function submit(form: any) {
   await AssistanceService.sendForm(form);
   if (isOpenedFromTg) {
      tg.sendData(JSON.stringify('Сохранено'));
   }
}

function onOpenLogin() {
   layoutStore.header.openLogin = !layoutStore.header.openLogin
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
   padding: 20px;
}

@media (max-width:480px) {
   .container {
      padding: 20px 5px;
   }
}
</style>