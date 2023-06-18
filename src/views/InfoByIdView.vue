<template>
  <div class="column items-center q-pa-sm">
    <h4 v-if="!isEditable" class="text-center q-my-lg q-pb-sm">{{ t('infoById.title') }}</h4>
    <QMarkupTable v-if="!isEditable" :class="$style.table" separator="cell">
      <thead>
        <tr>
          <th colspan="2">
            <div class="row justify-between items-center">
              <div class="text-h6">{{ t('infoById.table.title') }}</div>
              <QBtn icon="eva-edit" dense flat round @click="$router.push({ query: { edit: 'true' } })">
                <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('info.hints.edit') }}</QTooltip>
              </QBtn>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) of form" :key="key">
          <td>{{ t(`assistance.fields.${key}`) }}</td>
          <td>{{ Util.formatAssistanceValue(value, key, t, form?.district) }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
    <FormAssistance
      v-else-if="form && isEditable"
      :class="$style.table"
      :form="form"
      :loading="isUpdating"
      :reset="false"
      :title="t('infoById.form.title')"
      @submit="form && updateForm(form, formId)"
    >
      <template #submit="{ type, valid }">
        <QBtn
          :type="type"
          :loading="isUpdating"
          :disable="!valid"
          color="positive"
          icon="eva-checkmark-outline"
          round
          dense
          flat
        />
      </template>
      <template #cancel>
        <QBtn color="negative" icon="eva-close-outline" round dense flat @click="$router.push({ query: undefined })" />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import FormAssistance from '~/FormAssistance.vue';
import type { AssistanceResponse, I18n, Langs } from '@/types';
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

type T = Omit<AssistanceResponse, '_id'>;
type S = (typeof AssistanceService)['getFormById'];

const { t } = useI18n<I18n, Langs>();
const router = useRouter();
const route = useRoute();
const formId = computed(() => String(route.params.id));
const isEditable = computed(() => !!route.query.edit);
const { request, data: form } = useFetch<T, S>(AssistanceService.getFormById);
const { request: updateForm, loading: isUpdating } = useFetch(AssistanceService.updateForm, {
  afterResponse: () => router.push({ query: undefined }),
});

onMounted(() => request(formId.value));
</script>

<style lang="scss" module>
.table {
  max-width: 600px;
  width: 100%;
}
</style>
