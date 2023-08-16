<template>
  <div
    v-if="!(alert instanceof ChatAlert)"
    :class="[$style.alert, $style[alert.type], 'q-pa-sm', 'row', 'q-mt-sm', 'items-center', 'no-wrap']"
    @click="emit('hideById', alert.id)"
  >
    <div class="q-mr-sm">
      <QIcon :name="icon" size="25px" />
    </div>
    <div class="text-body1">{{ alert.message }}</div>
  </div>
  <div
    v-else-if="alert instanceof ChatAlert"
    :class="[$style.alert, $style.chat, 'q-mt-sm']"
    @click="emit('hideById', alert.id)"
  >
    <QItem v-ripple clickable>
      <QItemSection avatar>
        <QIcon name="eva-message-square-outline" color="white" />
      </QItemSection>
      <QItemSection>
        <QItemLabel class="text-subtitle2">
          {{ alert.group?.title ? `${alert.author.name} in ${alert.group?.title}` : alert.author.name }}
        </QItemLabel>
        <QItemLabel class="text-body1" lines="2">{{ message }}</QItemLabel>
      </QItemSection>
    </QItem>
  </div>
</template>

<script setup lang="ts">
import { ChatAlert, type Alert } from '@/models';
import { computed } from 'vue';

interface Props {
  alert: Alert | ChatAlert;
  icon: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ hideById: [id: string] }>();
const message = computed(() => {
  let message = props.alert.message;
  if (props.alert instanceof ChatAlert) {
    if (props.alert.attachments.at(0)?.mime.includes('image')) {
      message = 'Изображение';
    } else if (props.alert.attachments.length) {
      message = 'Аудиосообщение';
    }
  }
  return message;
});
</script>

<style lang="scss" module>
.alert {
  min-height: 50px;
  width: 250px;
  padding: 5px 5px !important;
  border-radius: 5px;
  color: white;
  cursor: pointer;

  & .alert_text {
    margin-left: 5px;
    font-size: 1.1rem;
    overflow-wrap: break-word;
  }
}

.chat {
  background-color: $indigo;

  &:hover {
    background-color: $indigo-6;
  }
}

.success {
  background-color: $green;

  &:hover {
    background-color: $green-5;
  }
}

.error {
  background-color: $negative;

  &:hover {
    background-color: $red-9;
  }
}

.warning {
  background-color: $warning;

  &:hover {
    background-color: $yellow-7;
  }
}

.info {
  background-color: $info;

  &:hover {
    background-color: $blue-4;
  }
}
</style>
