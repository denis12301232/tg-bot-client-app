<template>
  <QForm ref="formRef" no-error-focus @submit.prevent="submit">
    <h4 class="q-py-lg text-center">{{ title }}</h4>
    <FormAssistanceGroup class="q-mt-sm" :title="t('home.form.sections.fio')">
      <QInput
        v-model.trim="form.surname"
        :label="t('home.form.placeholders.surname')"
        :rules="formRules.surname"
        lazy-rules
        maxlength="50"
        counter
      />
      <QInput
        v-model.trim="form.name"
        :label="t('home.form.placeholders.name')"
        :rules="formRules.name"
        lazy-rules
        maxlength="50"
        counter
      />
      <QInput
        v-model.trim="form.patronymic"
        :label="t('home.form.placeholders.patronimyc')"
        :rules="formRules.patronymic"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.phone')">
      <QInput
        v-model="form.phone"
        :label="t('home.form.placeholders.phone')"
        :rules="formRules.phone"
        type="tel"
        mask="(###) ### - ####"
        unmasked-value
        fill-mask
        prefix="+38"
        lazy-rules
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.birth')">
      <QInput
        v-model="form.birth"
        :label="t('home.form.placeholders.birth')"
        mask="date"
        :rules="formRules.birth"
        lazy-rules
      >
        <template #append>
          <QIcon class="cursor-pointer" name="eva-calendar">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QDate
                v-model="form.birth"
                emit-immediately
                default-year-month="2000/12"
                color="primary"
                :locale="messages[locale].calendar"
              >
                <div class="row items-center justify-end">
                  <QBtn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </QDate>
            </QPopupProxy>
          </QIcon>
        </template>
      </QInput>
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.adres')">
      <QSelect
        v-model="form.district"
        :label="t('home.form.placeholders.district')"
        :rules="formRules.district"
        :options="districtOptions"
        lazy-rules
        emit-value
        map-options
      />
      <QSelect
        v-model.trim="form.street"
        :label="t('home.form.placeholders.street')"
        :rules="formRules.street"
        :options="streetOptions"
        lazy-rules
        map-options
        emit-value
      >
        <template #no-option>
          <QItem>
            <QItemSection class="text-negative">{{ t('assistance.msgs.selectDistrict') }}</QItemSection>
          </QItem>
        </template>
      </QSelect>
      <QInput
        v-model.trim="form.house"
        :label="t('home.form.placeholders.house')"
        :rules="formRules.house"
        lazy-rules
        maxlength="50"
        counter
      />
      <QInput
        v-model.trim="form.flat"
        :label="t('home.form.placeholders.flat')"
        :rules="formRules.flat"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.peopleNum')">
      <QInput
        v-model.trim="form.people_num"
        :label="t('home.form.placeholders.peopleNum')"
        :rules="formRules.people_num"
        lazy-rules
        maxlength="2"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="Number(form.people_num) > 1" :title="t('home.form.sections.peopleFio')">
      <QInput
        v-for="i in Number(form.people_num) - 1 > 10 ? 10 : Number(form.people_num) - 1"
        v-model.trim="form.people_fio[i - 1]"
        :key="i"
        :label="`${t('home.form.placeholders.peopleFio')} ${i}-го`"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.invalids')">
      <QOptionGroup v-model="form.invalids" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.kids')">
      <QOptionGroup v-model="form.kids" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.kids" :title="t('home.form.sections.kidsAge')">
      <QOptionGroup
        v-model="form.kids_age"
        type="checkbox"
        :options="kidsAgeOptions"
        style="margin-left: -16px"
        color="indigo"
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.food')">
      <QOptionGroup v-model="form.food" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.water')">
      <QOptionGroup v-model="form.water" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.medecines')">
      <QOptionGroup v-model="form.medicines" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.medicines" :title="t('home.form.sections.medicinesInfo')">
      <QInput
        v-model.trim="form.medicines_info"
        :label="t('home.form.placeholders.medicinesInfo')"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.hygiene')">
      <QOptionGroup v-model="form.hygiene" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.hygiene" :title="t('home.form.sections.hygieneInfo')">
      <QInput
        v-model.trim="form.hygiene_info"
        :label="t('home.form.placeholders.hygieneInfo')"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.pampers')">
      <QOptionGroup v-model="form.pampers" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.pampers" :title="t('home.form.sections.pampersInfo')">
      <QInput
        v-model.trim="form.pampers_info"
        :abel="t('home.form.placeholders.pampersInfo')"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.diet')">
      <QInput v-model.trim="form.diet" :label="t('home.form.placeholders.diet')" lazy-rules maxlength="50" counter />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.persDataAgreement')">
      <QCheckbox
        v-model="form.pers_data_agreement"
        :label="t('home.form.placeholders.persDataAgreement')"
        style="margin-left: -8px"
        color="indigo"
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.photoAgreement')">
      <QCheckbox
        v-model="form.photo_agreement"
        :label="t('home.form.placeholders.photoAgreement')"
        style="margin-left: -8px"
        color="indigo"
      />
    </FormAssistanceGroup>
    <div class="row justify-between q-mt-sm">
      <slot name="submit" type="submit" :valid="valid" />
      <slot name="cancel" />
    </div>
  </QForm>
</template>

<script setup lang="ts">
import type { AssistanceResponse, I18n, Langs } from '@/types';
import type { QForm } from 'quasar';
import FormAssistanceGroup from '~/FormAssistanceGroup.vue';
import { ref, reactive, watch, computed } from 'vue';
import { Validate } from '@/util';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  form: Omit<AssistanceResponse, '_id'>;
  title: string;
  loading: boolean;
  reset: boolean;
}>();
const emit = defineEmits<{
  (event: 'submit', form: Omit<AssistanceResponse, '_id'>): void;
}>();

const { t, messages, locale } = useI18n<I18n, Langs>();
// eslint-disable-next-line vue/no-dupe-keys
const form = reactive(props.form);
const formRef = ref<QForm | null>(null);
const valid = ref(false);
const yesNoOptions = computed(() => [
  { label: t('assistance.checkboxes.yesNo.yes'), value: true },
  { label: t('assistance.checkboxes.yesNo.no'), value: false },
]);
const kidsAgeOptions = computed(() =>
  Object.entries(messages.value[locale.value].assistance.checkboxes.kidsAge).map(([key, value]) => ({
    label: value,
    value: key,
  }))
);

const districtOptions = computed(() =>
  Object.entries(messages.value[locale.value].assistance.districts).map(([key, value]) => ({
    label: value,
    value: key,
  }))
);
const streetOptions = computed(() =>
  form.district
    ? Object.entries(messages.value[locale.value].assistance.streets[form.district as '1'])
        .map(([key, value]) => ({ label: value, value: key }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : []
);

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
  surname: [(v: string) => Validate.required(v) || t('home.form.errors.surname.required')],
  name: [(v: string) => Validate.required(v) || t('home.form.errors.name.required')],
  patronymic: [(v: string) => Validate.required(v) || t('home.form.errors.patronymic.required')],
  phone: [
    (v: string) => Validate.required(v) || t('home.form.errors.phone.required'),
    (v: string) => Validate.isPhone(v.replace(/\s|-|\(|\)/g, '')) || t('home.form.errors.phone.isPhone'),
  ],
  birth: [
    (v: string) => Validate.required(v) || t('home.form.errors.birth.required'),
    (v: string) => Validate.isYYYYMMDD(v) || t('home.form.errors.birth.isYYYYMMDD'),
  ],
  district: [(v: string) => Validate.required(v) || t('home.form.errors.district.required')],
  street: [(v: string) => Validate.required(v) || t('home.form.errors.street.required')],
  house: [(v: string) => Validate.required(v) || t('home.form.errors.house.required')],
  flat: [
    (v: string) => Validate.required(v) || t('home.form.errors.flat.required'),
    (v: string) => Validate.isNumber(v) || t('home.form.errors.flat.isNumber'),
  ],
  people_num: [
    (v: string) => Validate.required(v) || t('home.form.errors.peopleNum.required'),
    (v: string) => Validate.isNumber(v) || t('home.form.errors.peopleNum.isNumber'),
    (v: string) => Validate.minMax(1, 10)(v) || t('home.form.errors.peopleNum.minMax'),
  ],
};

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
