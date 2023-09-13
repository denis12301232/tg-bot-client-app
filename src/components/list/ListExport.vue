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
        <form :class="$style.form" @submit.prevent="createReport(locale, type || 'xlsx')">
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
              :loading="isLoading"
              :disable="!type || isLoading || !props.ids.length"
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
import { ref } from 'vue';
import { AssistanceService } from '@/api/services';
import { useAlertStore } from '@/stores';
import { useI18n } from 'vue-i18n';

interface Props {
  ids: string[];
}

const props = defineProps<Props>();
const { addAlert } = useAlertStore();
const { t, locale } = useI18n();
const type = ref<'xlsx' | 'csv' | 'google-sheets' | null>(null);
const url = ref('');
const isLoading = ref(false);
const typeOptions = [
  { label: 'XLSX', value: 'xlsx' },
  { label: 'CSV', value: 'csv' },
  { label: 'GOOGLE SHEETS', value: 'google-sheets' },
];

async function createReport(locale: string, fileType: 'xlsx' | 'csv' | 'google-sheets') {
  try {
    isLoading.value = true;
    if (type.value === 'google-sheets') {
      const data = await AssistanceService.saveFormsToSheet(locale, props.ids).json<{ link: string }>();
      url.value = data.link;
    } else if (type.value === 'csv' || type.value === 'xlsx') {
      const blob = await AssistanceService.createReport(locale, fileType, props.ids).blob();
      const file = new File([blob], 'subtasks', {
        type: type.value === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      url.value = URL.createObjectURL(file);
    }
    addAlert('success', t('tools.sheets.msgs.success'));
  } catch (e) {
    addAlert('error', t('tools.sheets.msgs.error'));
  } finally {
    isLoading.value = false;
  }
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
