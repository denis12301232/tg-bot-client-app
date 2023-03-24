<template>
  <QTable v-if="subtasks.length" :columns="columns" :rows="subtasks" hide-pagination row-key="index" separator="cell">
    <template #body="{ row, rowIndex }">
      <QTr :key="rowIndex">
        <QTd>{{ row.title }}</QTd>
        <QTd>{{ row.description }}</QTd>
        <QTd auto-width>
          <div class="row justify-center">
            <QBtn dense flat round icon="delete" color="negative" @click="removeSubtask(rowIndex)" />
          </div>
        </QTd>
      </QTr>
    </template>
  </QTable>
  <QForm ref="formRef" no-error-focus>
    <QInput class="q-mt-sm" v-model="title" filled label="Название" counter maxlength="30" :rules="rules.title" />
    <QInput
      class="q-mt-sm"
      v-model="description"
      filled
      label="Описание"
      type="textarea"
      counter
      maxlength="2048"
      :rules="rules.description"
    />
    <QBtn class="q-mt-sm" color="primary" :disable="!valid" label="Добавить" @click="addSubtask" />
  </QForm>
</template>

<script setup lang="ts">
import type { QForm, QTable } from 'quasar';
import { ref, watch, computed } from 'vue';
import { Validate } from '@/util';

const props = defineProps<{
  title: string;
  description: string;
  subtasks: { title: string; description: string }[];
}>();

const emit = defineEmits<{
  (event: 'update:title', value: string): void;
  (event: 'update:description', value: string): void;
  (event: 'update:subtasks', value: { title: string; description: string }[]): void;
}>();

const formRef = ref<QForm | null>(null);
const valid = ref(false);
const title = computed({
  get() {
    return props.title;
  },
  set(value) {
    emit('update:title', value);
  },
});
const description = computed({
  get() {
    return props.description;
  },
  set(value) {
    emit('update:description', value);
  },
});
const subtasks = computed({
  get() {
    return props.subtasks;
  },
  set(value) {
    emit('update:subtasks', value);
  },
});

const rules = {
  title: [(v: string) => Validate.required(v) || 'Заполните поле'],
  description: [(v: string) => Validate.required(v) || 'Заполните поле'],
};

watch([title, description], () => {
  formRef.value?.validate().then((v) => (valid.value = v));
});

function addSubtask() {
  subtasks.value.push({ title: title.value, description: description.value });
  title.value = '';
  description.value = '';
  formRef.value?.reset();
  formRef.value?.resetValidation();
}

function removeSubtask(index: number) {
  subtasks.value.splice(index, 1);
}

const columns: QTable['columns'] = [
  { name: 'title', label: 'Название', align: 'center', field: 'title', headerStyle: 'font-size: 1.1em;' },
  { name: 'description', label: 'Описание', align: 'center', field: 'description', headerStyle: 'font-size: 1.1em;' },
  { name: 'delete', label: 'Убрать', align: 'center', field: 'status', headerStyle: 'font-size: 1.1em;' },
];
</script>

<style lang="scss" module>
.field {
  margin-top: 10px;
}

.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
