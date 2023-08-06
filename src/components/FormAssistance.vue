<template>
  <QForm ref="formRef" no-error-focus @submit.prevent="submit">
    <h4 class="q-py-lg text-center">{{ title }}</h4>
    <FormAssistanceGroup class="q-mt-sm" :title="t('home.form.sections.fio')">
      <QInput
        v-model.trim="form.surname"
        :label="t('home.form.fields.surname.placeholder')"
        :rules="rules.surname"
        lazy-rules
        maxlength="100"
        counter
      />
      <QInput
        v-model.trim="form.name"
        :label="t('home.form.fields.name.placeholder')"
        :rules="rules.name"
        lazy-rules
        maxlength="100"
        counter
      />
      <QInput
        v-model.trim="form.patronymic"
        :label="t('home.form.fields.patronymic.placeholder')"
        :rules="rules.patronymic"
        lazy-rules
        maxlength="100"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.phone')">
      <QInput
        v-model="form.phone"
        :label="t('home.form.fields.phone.placeholder')"
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
        :label="t('home.form.fields.birth.placeholder')"
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
                :locale="messages[locale].extra.calendar"
              >
                <div class="row items-center justify-end">
                  <QBtn v-close-popup :label="t('extra.calendar.close')" color="primary" flat />
                </div>
              </QDate>
            </QPopupProxy>
          </QIcon>
        </template>
      </QInput>
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.address')">
      <QSelect
        v-model="form.district"
        :label="t('home.form.fields.district.placeholder')"
        :rules="rules.district"
        :options="districtOptions"
        lazy-rules
        emit-value
        map-options
      />
      <QSelect
        v-model.trim="form.street"
        :label="t('home.form.fields.street.placeholder')"
        :rules="rules.street"
        :options="getStreetOptions(form.district)"
        lazy-rules
        map-options
        emit-value
      >
        <template #no-option>
          <QItem>
            <QItemSection class="text-negative">{{ t('home.form.fields.street.errors.district') }}</QItemSection>
          </QItem>
        </template>
      </QSelect>
      <QInput
        v-model.trim="form.house"
        :label="t('home.form.fields.house.placeholder')"
        :rules="rules.house"
        lazy-rules
        maxlength="50"
        counter
      />
      <QInput
        v-model.trim="form.flat"
        :label="t('home.form.fields.flat.placeholder')"
        :rules="rules.flat"
        lazy-rules
        maxlength="50"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.peopleCount')">
      <QInput
        v-model.trim="form.peopleCount"
        :label="t('home.form.fields.peopleCount.placeholder')"
        :rules="rules.peopleCount"
        lazy-rules
        maxlength="2"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.peopleCount > 1" :title="t('home.form.sections.peopleFio')">
      <QInput
        v-for="i in form.peopleCount - 1 > 10 ? 10 : form.peopleCount - 1"
        v-model.trim="form.peopleFio[i - 1]"
        :key="i"
        :label="`${t('home.form.fields.peopleFio.placeholder')} ${i}-го`"
        lazy-rules
        maxlength="100"
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
        v-model="form.kidsAge"
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
        v-model.trim="form.medicinesInfo"
        :label="t('home.form.fields.medicinesInfo.placeholder')"
        lazy-rules
        maxlength="500"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.hygiene')">
      <QOptionGroup v-model="form.hygiene" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.hygiene" :title="t('home.form.sections.hygieneInfo')">
      <QInput
        v-model.trim="form.hygieneInfo"
        :label="t('home.form.fields.hygieneInfo.placeholder')"
        lazy-rules
        maxlength="500"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.pampers')">
      <QOptionGroup v-model="form.pampers" :options="yesNoOptions" style="margin-left: -16px" color="indigo" />
    </FormAssistanceGroup>
    <FormAssistanceGroup v-if="form.pampers" :title="t('home.form.sections.pampersInfo')">
      <QInput
        v-model.trim="form.pampersInfo"
        :label="t('home.form.fields.pampersInfo.placeholder')"
        lazy-rules
        maxlength="500"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.extraInfo')">
      <QInput
        v-model.trim="form.extraInfo"
        :label="t('home.form.fields.extraInfo.placeholder')"
        lazy-rules
        maxlength="500"
        counter
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.personalDataAgreement')">
      <QCheckbox
        v-model="form.personalDataAgreement"
        :label="t('home.form.fields.personalDataAgreement.checkbox')"
        style="margin-left: -8px"
        color="indigo"
      />
    </FormAssistanceGroup>
    <FormAssistanceGroup :title="t('home.form.sections.photoAgreement')">
      <QCheckbox
        v-model="form.photoAgreement"
        :label="t('home.form.fields.photoAgreement.checkbox')"
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
import type { AssistanceResponse } from '@/types';
import type { QForm } from 'quasar';
import FormAssistanceGroup from '~/FormAssistanceGroup.vue';
import { ref, watch } from 'vue';
import { useAssistanceFormOptions, useVModel } from '@/hooks';
import { Rules } from '@/util';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: Omit<AssistanceResponse, '_id' | 'sector'>;
  title: string;
  loading: boolean;
  reset: boolean;
}>();
const emit = defineEmits<{
  (event: 'submit'): void;
}>();

const { t, messages, locale } = useI18n();
const { districtOptions, kidsAgeOptions, yesNoOptions, getStreetOptions } = useAssistanceFormOptions();
const rules = Rules.assistance(t);
// eslint-disable-next-line vue/no-dupe-keys
const form = useVModel<Omit<AssistanceResponse, '_id' | 'sector'>>();
const formRef = ref<QForm | null>(null);
const valid = ref(false);

watch(
  form,
  () => {
    formRef.value
      ?.validate()
      .then(
        (v) => (valid.value = v && form.value.personalDataAgreement && form.value.photoAgreement && !props.loading)
      );
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
