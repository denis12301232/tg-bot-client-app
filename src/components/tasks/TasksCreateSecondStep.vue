<template>
  <div>
    <slot name="subtasks" />
    <QForm ref="formRef" no-error-focus>
      <QInput
        class="q-mt-sm"
        v-model="title"
        standout
        :label="t('tasks.create.second.form.fields.title.placeholder')"
        counter
        maxlength="30"
        :rules="rules.title"
      />
      <QInput
        class="q-mt-sm"
        v-model="description"
        standout=""
        :label="t('tasks.create.second.form.fields.about.placeholder')"
        type="textarea"
        autogrow
        counter
        maxlength="2048"
        :rules="rules.description"
      />
      <QBtn
        class="q-mt-sm"
        color="primary"
        :disable="!valid"
        :label="t('tasks.create.second.form.buttons.add')"
        @click="addSubtask"
      />
    </QForm>
  </div>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch } from 'vue';
import { Validate } from '@/util';
import { useVModel } from '@/hooks';
import { useI18n } from 'vue-i18n';

interface Props {
  title: string;
  description: string;
  subtasks: { title: string; description: string }[];
}

defineProps<Props>();
defineEmits<{
  'update:title': [value: string];
  'update:description': [value: string];
  'update:subtasks': [value: Props['subtasks'][0]];
}>();

const { t } = useI18n();
const formRef = ref<QForm | null>(null);
const valid = ref(false);
// eslint-disable-next-line vue/no-dupe-keys
const title = useVModel<string>('title');
// eslint-disable-next-line vue/no-dupe-keys
const description = useVModel<string>('description');
// eslint-disable-next-line vue/no-dupe-keys
const subtasks = useVModel<Props['subtasks']>('subtasks');

const rules = {
  title: [(v: string) => Validate.required(v) || t('tasks.create.second.form.fields.title.errors.required')],
  description: [(v: string) => Validate.required(v) || t('tasks.create.second.form.fields.about.errors.required')],
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
