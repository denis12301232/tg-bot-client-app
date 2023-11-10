<template>
  <QCard class="overflow-hidden">
    <QCardActions align="right">
      <QBtn v-close-popup icon="eva-close-outline" dense flat round color="negative" />
    </QCardActions>
    <div class="q-py-md q-px-sm" style="height: calc(100vh - 50px)">
      <QScrollArea
        class="fit"
        :thumb-style="{ width: '7px' }"
        :content-style="{ position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center' }"
        :content-active-style="{ position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center' }"
      >
        <form :class="$style.form" @submit.prevent="query">
          <h5 class="q-pa-lg text-center">{{ t('applications.export.title') }}</h5>
          <QSelect
            v-model="type"
            :label="t('applications.export.type.placeholder')"
            :options="typeOptions"
            map-options
            emit-value
            standout
          />
          <div v-if="type" class="column items-center">
            <QBtn
              class="q-mt-md"
              color="primary"
              type="submit"
              :loading="loading"
              :disable="!type || loading || !props.ids.length"
            >
              {{ t('applications.export.buttons.save') }}
            </QBtn>
            <a v-if="url" :class="[$style.link, 'q-mt-sm']" target="_blank" :href="url">
              {{ t('applications.export.messages.link') }}
            </a>
          </div>
        </form>
      </QScrollArea>
    </div>
  </QCard>
</template>

<script setup lang="ts">
import type { Props } from '@/types';
import { computed, ref } from 'vue';
import { AssistanceService } from '@/api/services';
import { useAlertStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useQuery } from '@/hooks';

const props = defineProps<Props.List.Export>();
const { t } = useI18n();
const { addAlert } = useAlertStore();
const { query, loading } = useQuery(createReport, { onSuccess, onError });
const type = ref<'xlsx' | 'csv' | 'google-sheets' | null>(null);
const url = ref('');
const mime = computed(() =>
  type.value === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
);
const typeOptions = [
  { label: 'XLSX', value: 'xlsx' },
  { label: 'CSV', value: 'csv' },
  { label: 'GOOGLE SHEETS', value: 'google-sheets' },
];

function createReport() {
  const data =
    type.value === 'xlsx' || type.value === 'csv'
      ? AssistanceService.createReport(type.value, props.ids)
      : AssistanceService.saveFormsToSheet(props.ids);

  return data;
}

function onSuccess(value: { link: string } | Blob) {
  value instanceof Blob
    ? (url.value = URL.createObjectURL(new File([value], 'file', { type: mime.value })))
    : (url.value = value.link);

  addAlert('success', t('applications.export.messages.success'));
}

function onError() {
  addAlert('error', t('applications.export.messages.error'));
}
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
