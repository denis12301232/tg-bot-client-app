<template>
  <div class="column items-center q-pa-sm">
    <h4 v-if="!isEditable" class="text-center q-my-lg q-pb-sm">{{ t('applicationsId.title') }}</h4>
    <QMarkupTable v-if="!isEditable" :class="$style.table" separator="cell">
      <thead>
        <tr>
          <th colspan="2">
            <div class="row justify-between items-center">
              <div class="text-h6">{{ t('applicationsId.table.title') }}</div>
              <QBtn icon="eva-edit" dense flat round @click="setEditable">
                <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                  {{ t('applicationsSearch.hints.edit') }}
                </QTooltip>
              </QBtn>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) of form" :key="key">
          <td>{{ t(`home.form.fields.${key}.value`) }}</td>
          <td>{{ Util.formatAssistanceValue(value, key, t, form?.district) }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
    <FormAssistance
      v-else-if="form && isEditable"
      v-model="form"
      :class="$style.table"
      :loading="isUpdating"
      :reset="false"
      :title="t('applicationsId.form.title')"
      @submit="form && update(props.id, form)"
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
        <QBtn color="negative" icon="eva-close-outline" round dense flat @click="setEditable" />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import FormAssistance from '~/FormAssistance.vue';
import type { Responses } from '@/types';
import { onMounted, ref } from 'vue';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const isEditable = ref(false);
const { request, data: form } = useFetch<Omit<Responses.Assistance, '_id'>, typeof AssistanceService.show>(
  AssistanceService.show
);
const { request: update, loading: isUpdating } = useFetch(AssistanceService.update, {
  afterResponse: setEditable,
});

onMounted(() => request(props.id));

function setEditable() {
  isEditable.value = !isEditable.value;
}
</script>

<style lang="scss" module>
.table {
  max-width: 600px;
  width: 100%;
}
</style>
