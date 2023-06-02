<template>
  <div class="column items-center q-pa-sm">
    <form
      :class="$style.form"
      @submit.prevent="request({ birth: { from: query.birth.min, to: query.birth.max }, district: query.district })"
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
        />
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
      <div v-if="valid" class="column items-center">
        <QBtn class="q-mt-md" color="red-10" type="submit" :loading="loading" :disable="!valid">
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
import { useStore } from '@/stores';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { useI18n } from 'vue-i18n';

type Criterias = 'district' | 'birth';
type T = { message: string; link: string };
type S = typeof AssistanceService.saveFormsToSheet;

const { t } = useI18n<I18n, Langs>({ useScope: 'global' });
const store = useStore();
const criterias = ref<Criterias[]>([]);
const query = reactive({ district: '', birth: { min: 1920, max: 2022 } });
const valid = computed(() => !!criterias.value.length);
const { request, loading, data } = useFetch<T, S>(AssistanceService.saveFormsToSheet, {
  afterResponse: ({ response }) => {
    response.status === 200
      ? store.setAlert(true, { message: 'Сформировано' })
      : store.setAlert(true, { message: 'Ничего не найдено по запросу!', type: 'error' });
  },
});
const options = computed(() => [
  { label: t('tools.sheets.checkbox.district'), value: 'district' },
  { label: t('tools.sheets.checkbox.year'), value: 'birth' },
]);
const districtOptions = computed(() => [
  { label: t('assistance.districts.1'), value: 1 },
  { label: t('assistance.districts.2'), value: 2 },
  { label: t('assistance.districts.3'), value: 3 },
  { label: t('assistance.districts.4'), value: 4 },
  { label: t('assistance.districts.5'), value: 5 },
  { label: t('assistance.districts.6'), value: 6 },
  { label: t('assistance.districts.7'), value: 7 },
  { label: t('assistance.districts.8'), value: 8 },
  { label: t('assistance.districts.9'), value: 9 },
]);

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
