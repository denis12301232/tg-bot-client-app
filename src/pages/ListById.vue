<template>
  <div class="container">
    <div v-if="!isEditable">
      <h4 class="text-center">Заявка</h4>
      <div class="row justify-end q-mb-sm">
        <QBtn icon="edit" round dense flat @click="$router.push({ query: { edit: 'true' } })"></QBtn>
      </div>
      <QMarkupTable separator="cell">
        <tbody>
          <tr v-for="(key, value) in form">
            <td>{{ Constants.assistance[value] }}</td>
            <td>{{ useBeautifyAssistance(key) }}</td>
          </tr>
        </tbody>
      </QMarkupTable>
    </div>
    <FormAssistance
      v-else-if="form && isEditable"
      :form="form"
      :loading="isUpdateLoading"
      :reset="false"
      title="Редактировать заявку"
      @submit="onUpdateForm"
    >
      <template #submit="{ type, valid }">
        <QBtn
          :type="type"
          :loading="isUpdateLoading"
          :disable="!valid"
          color="positive"
          icon="done"
          round
          dense
          flat
        />
      </template>
      <template #cancel>
        <QBtn @click="$router.push({ query: undefined })" color="negative" icon="close" round dense flat />
      </template>
    </FormAssistance>
  </div>
</template>

<script setup lang="ts">
import type { AssistanceForm } from '@/types';
import FormAssistance from '~/FormAssistance.vue';
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useBeautifyAssistance } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Constants } from '@/util';

const props = defineProps<{
  id: string;
}>();
const router = useRouter();
const route = useRoute();
const isEditable = computed(() => !!route.query.edit);
const { f: onFetchForm, loading, error, data: form } = useFetch<AssistanceForm>({
  fn: () => AssistanceService.getFormById(props.id),
});
const { f: onUpdateForm, loading: isUpdateLoading } = useFetch({
  fn: (form) => AssistanceService.modifyAssistanceForm(form, props.id).then(() => router.push({ query: undefined })),
  alert: true,
  successMsg: 'Обновлено',
});

onMounted(onFetchForm);
</script>

<style lang="scss" scoped>
.container {
  width: 50%;
  padding: 20px 0 20px 0;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .container {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .container {
    width: 70%;
  }
}

@media (max-width: 560px) {
  .container {
    width: 95%;
  }
}
</style>
