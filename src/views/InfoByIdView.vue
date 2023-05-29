<template>
  <div class="column items-center q-pa-sm">
    <h4 v-if="!isEditable" class="text-center q-my-lg q-pb-sm">Заявка</h4>
    <QMarkupTable v-if="!isEditable" :class="$style.table" separator="cell">
      <thead>
        <tr>
          <th colspan="2">
            <div class="row justify-between items-center">
              <div class="text-h6">Найдено</div>
              <QBtn icon="eva-edit" dense flat round @click="$router.push({ query: { edit: 'true' } })" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) of form" :key="key">
          <td>{{ Constants.assistance[key] }}</td>
          <td>{{ Util.formatAssistanceKey(value) }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
    <FormAssistance
      v-else-if="form && isEditable"
      :class="$style.table"
      :form="form"
      :loading="isUpdating"
      :reset="false"
      title="Редактировать заявку"
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
        <QBtn @click="$router.push({ query: undefined })" color="negative" icon="eva-close-outline" round dense flat />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import FormAssistance from '~/FormAssistance.vue';
import type { AssistanceResponse } from '@/types';
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Util, Constants } from '@/util';

type T = Omit<AssistanceResponse, '_id'>;
type S = typeof AssistanceService['getFormById'];

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
