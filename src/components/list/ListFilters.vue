<template>
  <QCard :class="[$style.card, 'q-pa-lg', 'column', 'items-center']">
    <h5 class="q-mb-sm">{{ t('list.msgs.filter') }}</h5>
    <QOptionGroup v-model="criterias" class="criterias q-py-sm" type="checkbox" :options="options" inline />
    <div class="full-width">
      <div v-if="criterias.includes('birth')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('tools.sheets.checkbox.year') }}</h6>
        <QBadge color="indigo">
          {{
            `${t('tools.sheets.year.placeholders.min')} ${query.birth.min} ${t('tools.sheets.year.placeholders.max')} ${
              query.birth.max
            }`
          }}
        </QBadge>
        <QRange v-model="query.birth" :min="1920" :max="new Date().getFullYear()" color="secondary" />
      </div>
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
      <div v-if="criterias.includes('sector')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('tools.sheets.checkbox.sector') }}</h6>
        <QInput v-model="query.sector" standout :label="t('tools.sheets.sector.placeholder')" />
      </div>
      <div v-if="criterias.length" class="column items-center">
        <QBtn v-close-popup class="q-mt-md" color="primary">
          {{ t('tools.sheets.buttons.save') }}
        </QBtn>
      </div>
    </div>
  </QCard>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18nT, useVModel } from '@/hooks';

const props = defineProps<{
  query: {
    district: string;
    street: string;
    sector: string;
    birth: {
      min: number;
      max: number;
    };
  };
  criterias: ('district' | 'birth' | 'street' | 'sector')[];
}>();

defineEmits<{
  'update:query': [query: typeof props.query];
  'update:criterias': [critery: typeof props.criterias];
}>();

const { t, locale, messages } = useI18nT();
// eslint-disable-next-line vue/no-dupe-keys
const query = useVModel<typeof props.query>('query');
// eslint-disable-next-line vue/no-dupe-keys
const criterias = useVModel<typeof props.criterias>('criterias');
const options = computed(() => [
  { label: t('tools.sheets.checkbox.year'), value: 'birth' },
  { label: t('tools.sheets.checkbox.district'), value: 'district' },
  { label: t('tools.sheets.checkbox.street'), value: 'street' },
  { label: t('tools.sheets.checkbox.sector'), value: 'sector' },
]);

const districtOptions = computed(() =>
  Object.entries(messages.value[locale.value].assistance.districts).map(([key, value]) => ({
    label: value,
    value: key,
  }))
);
const streetOptions = computed(() =>
  query.value.district
    ? Object.entries(messages.value[locale.value].assistance.streets[query.value.district as '1'])
        .map(([key, value]) => ({ label: value, value: key }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : []
);

watch(criterias, () => {
  if (!criterias.value.includes('district')) {
    query.value.district = '';
  }
  if (!criterias.value.includes('street')) {
    query.value.street = '';
  }
  if (!criterias.value.includes('birth')) {
    query.value.birth.min = 1920;
    query.value.birth.max = new Date().getFullYear();
  }
  if (!criterias.value.includes('sector')) {
    query.value.sector = '';
  }
});
</script>

<style lang="scss" module>
.card {
  max-width: 500px;
  width: 100% !important;
}
</style>
