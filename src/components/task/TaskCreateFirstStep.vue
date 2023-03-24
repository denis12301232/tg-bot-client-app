<template>
  <QForm ref="formRef" no-error-focus>
    <QInput
      class="q-mt-sm"
      v-model="title"
      filled
      label="Название"
      counter
      lazy-rules
      :rules="rules.title"
      :maxlength="30"
    >
    </QInput>
    <QInput
      class="q-mt-sm"
      v-model="tag"
      filled
      label="Теги"
      lazy-rules
      :rules="rules.tags"
      :readonly="tags.length >= 3"
      @keyup.enter="onAddTag"
      @blur="onAddTag"
    >
      <template #prepend v-if="tags.length">
        <QChip
          v-for="(tag, index) in tags"
          :class="$style.tag"
          :label="tag"
          clickable
          removable
          icon-remove="cancel"
          color="amber-8"
          text-color="white"
          size="md"
          @remove="onRemoveTag(index)"
        >
          <QTooltip :delay="1000">{{ tag }}</QTooltip>
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
import { ref, watch, computed } from 'vue';
import { Validate } from '@/util';

const props = defineProps<{
  title: string;
  tags: string[];
}>();
const emit = defineEmits<{
  (event: 'update:title', value: string): void;
  (event: 'update:tags', value: string[]): void;
  (event: 'valid', value: boolean): void;
}>();

const formRef = ref<QForm | null>(null);
const tag = ref('');
const title = computed({
  get() {
    return props.title;
  },
  set(value) {
    emit('update:title', value);
  },
});
const tags = computed({
  get() {
    return props.tags;
  },
  set(value) {
    emit('update:tags', value);
  },
});

const rules = {
  title: [(v: string) => Validate.required(v) || 'Заполните поле'],
  tags: [() => Validate.lengthInterval(1, 3)(tags.value) || 'Введите хотя бы один тег'],
};

watch(
  [title, tags],
  () => {
    formRef.value?.validate().then((v) => emit('valid', v));
  },
  { deep: true }
);

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
