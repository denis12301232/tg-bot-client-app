<template>
  <QForm ref="formRef" no-error-focus>
    <QInput
      v-model="title"
      class="q-mt-sm"
      standout
      :label="t('tasks.create.first.form.fields.title.placeholder')"
      counter
      lazy-rules
      :rules="rules.title"
      :maxlength="30"
    >
    </QInput>
    <QInput
      v-model="tag"
      class="q-mt-sm"
      standout
      :label="t('tasks.create.first.form.fields.tags.placeholder')"
      lazy-rules
      :rules="rules.tags"
      :readonly="tags.length >= 3"
      @keyup.enter="onAddTag"
      @blur="onAddTag"
    >
      <template #prepend v-if="tags.length">
        <QChip
          v-for="(tag, index) in tags"
          :key="index"
          :class="$style.tag"
          :label="tag"
          clickable
          removable
          icon-remove="eva-close-circle"
          color="indigo"
          text-color="white"
          size="md"
          @remove="onRemoveTag(index)"
        >
          <QTooltip class="bg-indigo" :delay="1000">{{ tag }}</QTooltip>
        </QChip>
      </template>
      <template #counter>
        <div>{{ tags.length + ' / ' + 3 }}</div>
      </template>
    </QInput>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch } from 'vue';
import { Validate } from '@/util';
import { useVModel } from '@/hooks';
import { useI18n } from 'vue-i18n';

interface Props {
  title: string;
  tags: string[];
}

defineProps<Props>();
const emit = defineEmits<{
  'update:title': [title: string];
  'update:tags': [tags: string[]];
  valid: [value: boolean];
}>();

const { t } = useI18n();
const formRef = ref<QForm | null>(null);
const tag = ref('');
// eslint-disable-next-line vue/no-dupe-keys
const title = useVModel<string>('title');
// eslint-disable-next-line vue/no-dupe-keys
const tags = useVModel<string[]>('tags');

const rules = {
  title: [(v: string) => Validate.required(v) || t('tasks.create.first.form.fields.title.errors.required')],
  tags: [
    () => Validate.lengthInterval(1, 3)(tags.value) || t('tasks.create.first.form.fields.tags.errors.lengthInterval'),
  ],
};

watch([title, () => tags.value.length], () => {
  formRef.value?.validate().then((v) => emit('valid', v));
});

function onAddTag() {
  if (tag.value) {
    tags.value.push(tag.value);
    tag.value = '';
  }
}

function onRemoveTag(index: number) {
  tags.value.splice(index, 1);
}
</script>

<style lang="scss" module>
.tag {
  max-width: 90px;
}
</style>
