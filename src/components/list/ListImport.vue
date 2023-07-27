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
          <h5 class="text-center q-my-lg">{{ t('tools.forms.title') }}</h5>
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
                @click="request(formData, lang)"
              />
            </template>
          </QFile>
          <div v-if="data" class="q-py-sm">
            <div>
              <span class="text-subtitle1 text-positive">{{ t('tools.forms.msgs.uploaded') }}:</span>
              {{ data.created }}
            </div>
            <div>
              <span class="text-subtitle1 text-negative">{{ t('tools.forms.msgs.errors') }}:</span>
              {{ data.errors.length }}
            </div>
          </div>
        </div>
        <QBtn
          class="q-my-md"
          color="pink-9"
          :icon="help ? 'eva-arrow-up-outline' : 'eva-arrow-down-outline'"
          :label="t('tools.forms.msgs.help')"
          @click="showHelp"
        />
        <QCard v-if="help" style="width: 100%; max-width: 800px">
          <QCardSection>
            <QList>
              <QItem v-for="how of messages[locale].tools.forms.msgs.how.length" :key="how">
                {{ how + '. ' + t(`tools.forms.msgs.how.${how - 1}`) }}.
              </QItem>
            </QList>
          </QCardSection>
          <QMarkupTable>
            <tbody>
              <tr>
                <th
                  v-for="field of messages[locale].assistance.fields"
                  :key="field"
                  class="text-center"
                  style="max-width: 100px"
                >
                  <div class="text-cut">
                    {{ field }}
                    <QTooltip>{{ field }}</QTooltip>
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
import type { Langs } from '@/types';
import { ref, watchEffect } from 'vue';
import { useFetch, useI18nT } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { QIcon } from 'quasar';

type T = { created: number; errors: { message: string; row: number }[] };
type S = typeof AssistanceService.uploadFormsListCSV;

const formData = new FormData();
const { t, locale, messages } = useI18nT();
const file = ref<File | null>(null);
const help = ref(false);
const lang = ref<Langs>('uk');
const { request, loading, data } = useFetch<T, S>(AssistanceService.uploadFormsListCSV, {
  alert: true,
  successMsg: t('tools.forms.msgs.success'),
  afterSuccess: () => (file.value = null),
});
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
