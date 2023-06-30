<template>
  <div class="column items-center q-pa-sm">
    <div :class="$style.content">
      <h5 class="text-center q-my-lg">{{ t('tools.forms.title') }}</h5>
      <QFile v-model="file" class="full-width" standout label="CSV" accept="text/csv" clearable>
        <template #prepend>
          <QIcon color="green" name="eva-cloud-upload-outline" />
        </template>
        <template v-if="file" #append>
          <QBtn
            icon="eva-checkmark-outline"
            :loading="loading"
            dense
            flat
            round
            color="positive"
            @click="request(formData)"
          />
        </template>
      </QFile>
      <div v-if="data" class="q-py-sm">
        <div>
          <span class="text-subtitle1 text-positive">Загружено:</span>
          {{ data.created }}
        </div>
        <div>
          <span class="text-subtitle1 text-negative">Ошибки:</span>
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
        <p class="text-body1 text-justify q-py-md q-px-sm">
          {{ t('tools.forms.msgs.how') }}
        </p>
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
          <tr>
            <td v-for="(value, index) of values" :key="index" class="text-center" style="max-width: 100px">
              <div class="text-cut">
                {{ value }}
                <QTooltip>{{ value }}</QTooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </QMarkupTable>
    </QCard>
  </div>
</template>

<script setup lang="ts">
import type { I18n, Langs } from '@/types';
import { ref, watchEffect } from 'vue';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { QIcon } from 'quasar';
import { useI18n } from 'vue-i18n';

type T = { created: number; errors: { message: string; row: number }[] };
type S = typeof AssistanceService.uploadFormsListCSV;

const formData = new FormData();
const { t, locale, messages } = useI18n<I18n, Langs>();
const file = ref<File | null>(null);
const help = ref(false);
const { request, loading, data } = useFetch<T, S>(AssistanceService.uploadFormsListCSV, {
  alert: true,
  successMsg: t('tools.forms.msgs.success'),
  afterSuccess: () => (file.value = null),
});

watchEffect((onCleanup) => {
  if (file.value) {
    formData.append('file', file.value);
  }
  onCleanup(() => formData.delete('file'));
});

function showHelp() {
  help.value = !help.value;
}

const values = [
  'Зайцева',
  'Эльвира',
  'Владимировна',
  '0964945166',
  '2000/12/12',
  1,
  25,
  16,
  10,
  2,
  'Зайцев Василий Иванович, Зайцева Алина Васильевна',
  false,
  true,
  '9-18',
  true,
  true,
  false,
  '',
  false,
  '',
  false,
  '',
  '',
  true,
  true,
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
