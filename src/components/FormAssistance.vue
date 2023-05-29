<template>
  <QForm ref="formRef" no-error-focus @submit.prevent="submit">
    <h4 class="q-py-lg text-center">{{ title }}</h4>
    <FormAssistanceGroup class="q-mt-sm" title="ФИО">
      <QInput v-model.trim="form.surname" label="Фамилия" :rules="formRules.surname" lazy-rules maxlength="50" />
      <QInput v-model.trim="form.name" label="Имя" :rules="formRules.name" lazy-rules maxlength="50" />
      <QInput v-model.trim="form.patronymic" label="Отчество" :rules="formRules.patronymic" lazy-rules maxlength="50" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Телефон">
      <QInput
        v-model="form.phone"
        label="Телефон"
        :rules="formRules.phone"
        mask="(###) ### - ####"
        fill-mask
        prefix="+38"
        lazy-rules
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Дата рождения">
      <QInput v-model="form.birth" label="Дата рождения" mask="date" :rules="formRules.birth" lazy-rules>
        <template #append>
          <QIcon class="cursor-pointer" name="eva-calendar">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QDate v-model="form.birth" emit-immediately default-year-month="2000/12" color="red-10">
                <div class="row items-center justify-end">
                  <QBtn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </QDate>
            </QPopupProxy>
          </QIcon>
        </template>
      </QInput>
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Адрес">
      <QSelect
        v-model="form.district"
        label="Район"
        :rules="formRules.district"
        :options="Constants.districts"
        lazy-rules
      />
      <QInput
        v-model.trim="form.street"
        label="Улица/проспект/переулок"
        :rules="formRules.street"
        lazy-rules
        maxlength="50"
      />
      <QInput v-model.trim="form.house" label="Дом" :rules="formRules.house" lazy-rules maxlength="50" />
      <QInput v-model.trim="form.flat" label="Квартира" :rules="formRules.flat" lazy-rules maxlength="50" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Число проживающих">
      <QInput
        v-model.trim="form.people_num"
        label="Число проживающих"
        :rules="formRules.people_num"
        lazy-rules
        maxlength="2"
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="Number(form.people_num) > 1" title="ФИО и возраст проживающих">
      <QInput
        v-for="i in Number(form.people_num) - 1 > 10 ? 10 : Number(form.people_num) - 1"
        v-model.trim="form.people_fio[i - 1]"
        :key="i"
        :label="`ФИО и возраст ${i}-го`"
        :rules="formRules.people_num"
        lazy-rules
        maxlength="50"
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Есть ли среди проживающих инвалиды?">
      <QOptionGroup v-model="form.invalids" :options="Constants.yesNoOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Есть ли дети?">
      <QOptionGroup v-model="form.kids" :options="Constants.yesNoOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.kids" title="Укажите возраст детей">
      <QOptionGroup v-model="form.kids_age" type="checkbox" :options="kidsAgeOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Нужна ли продукты питания?">
      <QOptionGroup v-model="form.food" :options="Constants.yesNoOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Нужна ли вода?">
      <QOptionGroup v-model="form.water" :options="Constants.yesNoOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Нужны ли лекарства?">
      <QOptionGroup v-model="form.medicines" :options="Constants.yesNoOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.medicines" title="Укажите какие">
      <QInput v-model.trim="form.medicines_info" label="Укажите какие" lazy-rules maxlength="50" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Средства личной гигиены">
      <QOptionGroup v-model="form.hygiene" :options="Constants.yesNoOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.hygiene" title="Укажите какие">
      <QInput v-model.trim="form.hygiene_info" label="Укажите какие" lazy-rules maxlength="50" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Памперсы?">
      <QOptionGroup v-model="form.pampers" :options="Constants.yesNoOptions" style="margin-left: -16px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.pampers" title="Укажите какие">
      <QInput v-model.trim="form.pampers_info" label="Укажите какие" lazy-rules maxlength="50" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Особенности диеты">
      <QInput v-model.trim="form.diet" label="Особенности диеты" lazy-rules maxlength="50" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Согласие на обработку персональных данных">
      <QCheckbox v-model="form.pers_data_agreement" label="Согласен/Согласна" style="margin-left: -8px" />
    </FormAssistanceGroup>
    <FormAssistanceGroup title="Согласие на фото/видео">
      <QCheckbox v-model="form.photo_agreement" label="Согласен/Согласна" style="margin-left: -8px" />
    </FormAssistanceGroup>
    <div class="row justify-between q-mt-sm">
      <slot name="submit" type="submit" :valid="valid" />
      <slot name="cancel" />
    </div>
  </QForm>
</template>

<script setup lang="ts">
import type { AssistanceResponse } from '@/types';
import type { QForm } from 'quasar';
import FormAssistanceGroup from '~/FormAssistanceGroup.vue';
import { ref, reactive, watch } from 'vue';
import { Validate, Constants } from '@/util';

const props = defineProps<{
  form: Omit<AssistanceResponse, '_id'>;
  title: string;
  loading: boolean;
  reset: boolean;
}>();
const emit = defineEmits<{
  (event: 'submit', form: Omit<AssistanceResponse, '_id'>): void;
}>();

// eslint-disable-next-line vue/no-dupe-keys
const form = reactive(props.form);
const formRef = ref<QForm | null>(null);
const valid = ref(false);

watch(
  form,
  () => {
    formRef.value
      ?.validate()
      .then((v) => (valid.value = v && form.pers_data_agreement && form.photo_agreement && !props.loading));
  },
  { deep: true }
);

const formRules = {
  surname: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
  name: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
  patronymic: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
  phone: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.isPhone(v.replace(/\s|-|\(|\)/g, '')) || 'Введите корректный номер',
  ],
  birth: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.isYYYYMMDD(v) || 'Введите корректую дату',
  ],
  district: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
  street: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
  house: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
  flat: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.isNumber(v) || 'Значение должно быть числом',
  ],
  people_num: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.isNumber(v) || 'Значение должно быть числом',
    (v: string) => Validate.minMax(1, 10)(v) || 'Минимум один и маскимум десять человек',
  ],
};
const kidsAgeOptions = [
  { label: 'от 0 до 1', value: '0-1' },
  { label: 'от 1 до 3', value: '1-3' },
  { label: 'от 3 до 9', value: '3-9' },
  { label: 'от 9 до 18', value: '9-18' },
];

function submit() {
  emit('submit', form);
  if (props.reset) {
    formRef.value?.reset();
    (Object.keys(form) as [keyof typeof props.form]).forEach((key) => {
      if (Array.isArray(form[key])) {
        (form[key] as []) = [];
      } else if (typeof form[key] === 'boolean') {
        (form[key] as boolean) = false;
      } else {
        (form[key] as any) = null;
      }
    });
  }
}
</script>
