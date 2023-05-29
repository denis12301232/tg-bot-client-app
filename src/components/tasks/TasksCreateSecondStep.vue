<template>
  <div>
    <slot name="subtasks" />
    <QForm ref="formRef" no-error-focus>
      <QInput class="q-mt-sm" v-model="title" standout label="Название" counter maxlength="30" :rules="rules.title" />
      <QInput
        class="q-mt-sm"
        v-model="description"
        standout=""
        label="Описание"
        type="textarea"
        autogrow
        counter
        maxlength="2048"
        :rules="rules.description"
      />
      <QBtn class="q-mt-sm" color="primary" :disable="!valid" label="Добавить" @click="addSubtask" />
    </QForm>
  </div>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch, computed } from 'vue';
import { Validate } from '@/util';

const props = defineProps<{
  title: string;
  description: string;
  subtasks: { title: string; description: string }[];
}>();

const emit = defineEmits<{
  'update:title': [value: string];
  'update:description': [value: string];
  'update:subtasks': [value: { title: string; description: string }[]];
}>();

const formRef = ref<QForm | null>(null);
const valid = ref(false);
// eslint-disable-next-line vue/no-dupe-keys
const title = computed({
  get() {
    return props.title;
  },
  set(value) {
    emit('update:title', value);
  },
});
// eslint-disable-next-line vue/no-dupe-keys
const description = computed({
  get() {
    return props.description;
  },
  set(value) {
    emit('update:description', value);
  },
});
// eslint-disable-next-line vue/no-dupe-keys
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
</script>
