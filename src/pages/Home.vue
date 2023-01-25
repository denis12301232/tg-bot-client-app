<template lang="pug">
HeaderLayout(@open-login="onOpenLogin")
   template(#form)
      QDialog(v-model="loginOpen")
         QCard
            component(:is="component" @swap="onSwap" @submit="onOpenLogin")
   div(class="container")
      FormAssistance(:form="form" title="Заявка на получение гуманитарной помощи" @submit="onSubmit" :loading="loading" reset)
         template(#submit="{type, valid}")
            QBtn(:type="type" :loading="loading" :disable="!valid" color="primary") Отправить
</template>


<script setup lang="ts">
import HeaderLayout from '@/layouts/HeaderLayout.vue'
import FormAssistance from '~/FormAssistance.vue'
import FormReg from '~/FormReg.vue'
import FormLog from '~/FormLog.vue'
import { reactive, ref, shallowRef } from 'vue'
import { useFetch } from '@/hooks'
import { AssistanceService } from '@/api/services'


const loginOpen = ref(false);
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
const { f: onSubmit, loading } = useFetch({
   fn: (form) => AssistanceService.sendForm(form),
   alert: true,
   successMsg: 'Сохранено'
});

function onOpenLogin() {
   loginOpen.value = !loginOpen.value;
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
</style>