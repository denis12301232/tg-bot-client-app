<template>
  <QForm ref="formRef" no-error-focus @submit.prevent="submit">
    <h4 class="q-py-lg text-center">{{ title }}</h4>
    <FormAssistanceGroup class="q-mt-sm" :title="t('home.form.sections.fio')">
      <QInput
        v-model.trim="form.surname"
        :label="t('home.form.placeholders.surname')"
        :rules="rules.surname"
        lazy-rules
        maxlength="50"
        counter
      />
      <QInput
        v-model.trim="form.name"
        :label="t('home.form.placeholders.name')"
        :rules="rules.name"
        lazy-rules
        maxlength="50"
        counter
      />
      <QInput
        v-model.trim="form.patronymic"
        :label="t('home.form.placeholders.patronimyc')"
        :rules="rules.patronymic"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.phone')">
      <QInput
        v-model="form.phone"
        :label="t('home.form.placeholders.phone')"
        :rules="rules.phone"
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
        :rules="rules.birth"
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
        :rules="rules.district"
        :options="districtOptions"
        lazy-rules
        emit-value
        map-options
      />
      <QSelect
        v-model.trim="form.street"
        :label="t('home.form.placeholders.street')"
        :rules="rules.street"
        :options="getStreetOptions(form.district)"
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
        :rules="rules.house"
        lazy-rules
        maxlength="50"
        counter
      />
      <QInput
        v-model.trim="form.flat"
        :label="t('home.form.placeholders.flat')"
        :rules="rules.flat"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.peopleNum')">
      <QInput
        v-model.trim="form.people_num"
        :label="t('home.form.placeholders.peopleNum')"
        :rules="rules.people_num"
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
import { ref, watch } from 'vue';
import { useAssistanceFormOptions, useVModel } from '@/hooks';
import { Rules } from '@/util';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: Omit<AssistanceResponse, '_id'>;
  title: string;
  loading: boolean;
  reset: boolean;
}>();
const emit = defineEmits<{
  (event: 'submit'): void;
}>();

const { t, messages, locale } = useI18n<I18n, Langs>();
const { districtOptions, kidsAgeOptions, yesNoOptions, getStreetOptions } = useAssistanceFormOptions();
const rules = Rules.assistance(t);
// eslint-disable-next-line vue/no-dupe-keys
const form = useVModel<Omit<AssistanceResponse, '_id'>>();
const formRef = ref<QForm | null>(null);
const valid = ref(false);

watch(
  form,
  () => {
    formRef.value
      ?.validate()
      .then((v) => (valid.value = v && form.value.pers_data_agreement && form.value.photo_agreement && !props.loading));
  },
  { deep: true }
);

function submit() {
  emit('submit');
  if (props.reset) {
    formRef.value?.reset();
    (Object.keys(form.value) as [keyof typeof form.value]).forEach((key) => {
      if (Array.isArray(form.value[key])) {
        (form.value[key] as []) = [];
      } else if (typeof form.value[key] === 'boolean') {
        (form.value[key] as boolean) = false;
      } else {
        (form.value[key] as any) = null;
      }
    });
  }
}
</script>
