<template>
  <QCard :class="[$style.card, 'q-pa-lg', 'column', 'items-center']">
    <h5 class="q-mb-sm">{{ t('applications.filter.title') }}</h5>
    <QOptionGroup v-model="criterias" class="criterias q-py-sm" type="checkbox" :options="options" inline />
    <div class="full-width">
      <div v-if="criterias.includes('birth')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('applications.filter.form.checkboxes[0]') }}</h6>
        <QBadge color="indigo">
          {{
            `${t('applications.filter.form.fields.year.min')} ${query.birth.min} ${t(
              'applications.filter.form.fields.year.max'
            )} ${query.birth.max}`
          }}
        </QBadge>
        <QRange v-model="query.birth" :min="1920" :max="new Date().getFullYear()" color="secondary" />
      </div>
      <div v-if="criterias.includes('district')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('applications.filter.form.checkboxes[1]') }}</h6>
        <QSelect
          v-model="query.district"
          class="full-width"
          :options="districtOptions"
          standout
          :label="t('applications.filter.form.fields.district.placeholder')"
          map-options
          emit-value
        />
      </div>
      <div v-if="criterias.includes('street')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('applications.filter.form.checkboxes[2]') }}</h6>
        <QSelect
          v-model="query.street"
          class="full-width"
          :options="streetOptions"
          standout
          :label="t('applications.filter.form.fields.street.placeholder')"
          map-options
          emit-value
        >
          <template #no-option>
            <QItem>
              <QItemSection class="text-negative">{{ t('applications.filter.messages.district') }}</QItemSection>
            </QItem>
          </template>
        </QSelect>
      </div>
      <div v-if="criterias.includes('sector')">
        <h6 class="q-mt-md q-mb-sm text-center">{{ t('applications.filter.form.checkboxes[3]') }}</h6>
        <QInput v-model="query.sector" standout :label="t('applications.filter.form.fields.sector.placeholder')" />
      </div>
      <div v-if="criterias.length" class="column items-center">
        <QBtn v-close-popup class="q-mt-md" color="primary">
          {{ t('applications.filter.form.buttons.set') }}
        </QBtn>
      </div>
    </div>
  </QCard>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useVModel } from '@/hooks';
import { useI18n } from 'vue-i18n';

interface Props {
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
}

const props = defineProps<Props>();
defineEmits<{
  'update:query': [query: typeof props.query];
  'update:criterias': [critery: typeof props.criterias];
}>();

const { t, locale, messages } = useI18n();
// eslint-disable-next-line vue/no-dupe-keys
const query = useVModel<typeof props.query>('query');
// eslint-disable-next-line vue/no-dupe-keys
const criterias = useVModel<typeof props.criterias>('criterias');
const options = computed(() => [
  { label: t('applications.filter.form.checkboxes[0]'), value: 'birth' },
  { label: t('applications.filter.form.checkboxes[1]'), value: 'district' },
  { label: t('applications.filter.form.checkboxes[2]'), value: 'street' },
  { label: t('applications.filter.form.checkboxes[3]'), value: 'sector' },
]);

const districtOptions = computed(() =>
  Object.entries(messages.value[locale.value].extra.districts).map(([key, value]) => ({
    label: value,
    value: key,
  }))
);
const streetOptions = computed(() =>
  query.value.district
    ? Object.entries(messages.value[locale.value].extra.streets[query.value.district as '1'])
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
