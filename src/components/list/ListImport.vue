<template>
  <QCard>
    <QCardActions align="right">
      <QBtn v-close-popup icon="eva-close-outline" dense flat round color="negative" />
    </QCardActions>
    <div style="height: calc(100vh - 50px)">
      <QScrollArea
        class="fit"
        :thumb-style="{ width: '7px' }"
        :content-style="{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 5px',
        }"
        :content-active-style="{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 5px',
        }"
      >
        <div :class="$style.content">
          <h5 class="text-center q-my-lg">{{ t('applications.import.title') }}</h5>
          <QSelect v-model="lang" class="q-mb-md" emit-value map-options label="Language" standout :options="options" />
          <QFile v-model="file" class="full-width" standout label="CSV" accept="text/csv" clearable>
            <template #prepend>
              <QIcon color="green" name="eva-cloud-upload-outline" />
            </template>
            <template v-if="file" #append>
              <QBtn
                icon="eva-checkmark-outline"
                dense
                flat
                round
                color="positive"
                :loading="loading"
                @click="query(formData, lang)"
              />
            </template>
          </QFile>
          <div v-if="data" class="q-py-sm">
            <div>
              <span class="text-subtitle1 text-positive">{{ t('applications.import.messages.uploaded') }}:</span>
              {{ data.created }}
            </div>
            <div>
              <span class="text-subtitle1 text-negative">{{ t('applications.import.messages.errors') }}:</span>
              {{ data.errors.length }}
            </div>
          </div>
        </div>
        <QBtn
          class="q-my-md"
          color="pink-9"
          :icon="help ? 'eva-arrow-up-outline' : 'eva-arrow-down-outline'"
          :label="t('applications.import.messages.help')"
          @click="showHelp"
        />
        <QCard v-if="help" style="width: 100%; max-width: 800px">
          <QMarkupTable>
            <tbody>
              <tr>
                <th
                  v-for="field of messages[locale].home.form.fields"
                  :key="field.value"
                  class="text-center"
                  style="max-width: 100px"
                >
                  <div class="text-cut">
                    {{ field.value }}
                    <QTooltip>{{ field.value }}</QTooltip>
                  </div>
                </th>
              </tr>
              <tr v-for="(item, index) of example" :key="index">
                <td v-for="(value, index) of item" :key="index" class="text-center" style="max-width: 100px">
                  <div class="text-cut">
                    {{ value }}
                    <QTooltip>{{ value }}</QTooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </QMarkupTable>
        </QCard>
      </QScrollArea>
    </div>
  </QCard>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useQuery } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { QIcon } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAlertStore } from '@/stores';

const { t, locale, messages } = useI18n();
const alertStore = useAlertStore();
const formData = new FormData();
const file = ref<File | null>(null);
const help = ref(false);
const lang = ref('uk');
const { query, data, loading } = useQuery(AssistanceService.uploadFormsCSV, { onSuccess });
const options = [
  { label: 'Русский', value: 'ru' },
  { label: 'Українська', value: 'uk' },
  { label: 'English', value: 'en' },
];

watchEffect((onCleanup) => {
  if (file.value) {
    formData.append('file', file.value);
  }
  onCleanup(() => formData.delete('file'));
});

function showHelp() {
  help.value = !help.value;
}

function onSuccess() {
  alertStore.addAlert('success', t('applications.import.messages.success'));
  file.value = null;
}

const example = [
  [
    'Зайцева',
    'Эльвира',
    'Владимировна',
    '0964945166',
    '2000/12/12',
    'Шевченковский',
    'Архитекторов улица',
    16,
    10,
    2,
    'Зайцев Василий Иванович, Зайцева Алина Васильевна',
    'Нет',
    'Да',
    '9-18',
    'Да',
    'Да',
    'Нет',
    '',
    'Нет',
    '',
    'Нет',
    '',
    '',
    'Да',
    'Да',
    '',
  ],
  [
    'Уткина',
    'Марья',
    'Фёдоровна',
    '0984765142',
    '1990/10/01',
    'Индустриалньный',
    'Авангардная улица',
    8,
    12,
    1,
    '',
    'Да',
    'Да',
    '',
    'Да',
    'Да',
    'Нет',
    '',
    'Нет',
    '',
    'Нет',
    '',
    '',
    'Да',
    'Да',
    'Ж5',
  ],
];
</script>

<style lang="scss" module>
.content {
  max-width: 500px;
  width: 100%;
  min-width: 290px;
}
.table {
  max-width: 800px;
  width: 100%;
  min-width: 290px;
}
</style>
