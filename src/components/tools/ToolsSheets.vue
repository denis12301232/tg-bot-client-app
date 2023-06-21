<template>
  <div class="column items-center q-pa-sm">
    <form
      :class="$style.form"
      @submit.prevent="
        request({
          birth: { from: query.birth.min, to: query.birth.max },
          district: query.district,
          street: query.street,
          locale,
        })
      "
    >
      <h5 class="q-pa-lg text-center">{{ t('tools.sheets.title') }}</h5>
      <QOptionGroup v-model="criterias" class="criterias" type="checkbox" :options="options" />
      <QSeparator />
      <div v-if="criterias.includes('district')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('tools.sheets.checkbox.district') }}</h6>
        <QSelect
          v-model="query.district"
          class="full-width"
          :options="districtOptions"
          standout
          :label="t('tools.sheets.district.placeholder')"
          map-options
          emit-value
        />
      </div>
      <div v-if="criterias.includes('street')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('tools.sheets.checkbox.street') }}</h6>
        <QSelect
          v-model="query.street"
          class="full-width"
          :options="streetOptions"
          standout
          :label="t('tools.sheets.street.placeholder')"
          map-options
          emit-value
        >
          <template #no-option>
            <QItem>
              <QItemSection class="text-negative">{{ t('assistance.msgs.selectDistrict') }}</QItemSection>
            </QItem>
          </template>
        </QSelect>
      </div>
      <div v-if="criterias.includes('birth')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('tools.sheets.checkbox.year') }}</h6>
        <QBadge color="indigo">
          {{
            `${t('tools.sheets.year.placeholders.min')} ${query.birth.min} ${t('tools.sheets.year.placeholders.max')} ${
              query.birth.max
            }`
          }}
        </QBadge>
        <QRange v-model="query.birth" :min="1920" :max="2022" color="secondary"></QRange>
      </div>
      <div v-if="criterias.length" class="column items-center">
        <QBtn class="q-mt-md" color="primary" type="submit" :loading="loading" :disable="!valid">
          {{ t('tools.sheets.buttons.save') }}
        </QBtn>
        <a v-if="data?.link" :class="[$style.link, 'q-mt-sm']" target="_blank" :href="data.link">
          {{ t('tools.sheets.link') }}
        </a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { ref, reactive, computed, watchEffect } from 'vue';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { useI18n } from 'vue-i18n';

type Criterias = 'district' | 'birth' | 'street';
type T = { message: string; link: string };
type S = typeof AssistanceService.saveFormsToSheet;

const { t, locale, messages } = useI18n<I18n, Langs>();
const criterias = ref<Criterias[]>([]);
const query = reactive({ district: '', street: '', birth: { min: 1920, max: 2022 } });
const valid = computed(() => {
  return (criterias.value.includes('district') && query.district) || criterias.value.includes('birth');
});
const { request, loading, data } = useFetch<T, S>(AssistanceService.saveFormsToSheet, {
  alert: true,
  successMsg: t('tools.sheets.msgs.success'),
  errorMsg: t('tools.sheets.msgs.error'),
});
const options = computed(() => [
  { label: t('tools.sheets.checkbox.district'), value: 'district' },
  { label: t('tools.sheets.checkbox.street'), value: 'street' },
  { label: t('tools.sheets.checkbox.year'), value: 'birth' },
]);
const districtOptions = computed(() =>
  Object.entries(messages.value[locale.value].assistance.districts).map(([key, value]) => ({
    label: value,
    value: key,
  }))
);
const streetOptions = computed(() =>
  query.district
    ? Object.entries(messages.value[locale.value].assistance.streets[query.district as '1'])
        .map(([key, value]) => ({ label: value, value: key }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : []
);

watchEffect(() => {
  if (!criterias.value.includes('district')) {
    query.district = '';
  }
  if (!criterias.value.includes('birth')) {
    query.birth.min = 1920;
    query.birth.max = 2022;
  }
});
</script>

<style lang="scss" module>
.form {
  max-width: 500px;
  width: 100%;
}
.link {
  display: block;
  color: $positive;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1em;
  margin-top: 5px;

  &:hover {
    color: $orange;
  }
}
</style>
