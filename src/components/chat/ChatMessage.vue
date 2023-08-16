<template>
  <div :class="['row', 'items-end', sent ? '' : 'reverse']">
    <div
      :class="[
        $style.message,
        sent ? $style.sent : $style.recived,
        'text-white',
        'inline-block',
        'q-pa-sm',
        'text-body',
      ]"
    >
      <div class="column">
        <div :class="$style.text">{{ text }}</div>
        <slot name="audio" />
      </div>

      <div class="row justify-between items-end">
        <slot name="reactions" />
        <div class="row">
          <div :class="[$style.time, 'q-ml-sm', 'text-subtitle2', 'text-weight-thin']">
            <QTooltip :delay="1000">{{ d(time, 'short') }}</QTooltip>
            {{ d(time, 'time') }}
          </div>
          <QIcon v-if="sent" class="q-ml-sm" :name="icon" />
        </div>
      </div>
    </div>

    <slot name="avatar" :classes="sent ? 'q-ml-sm' : 'q-mr-sm'" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  text?: string;
  read?: boolean;
  time: Date | string;
  sent?: boolean;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), { read: false, sent: false, color: '#1976d2' });
const { d } = useI18n();
const icon = computed(() => (props.read ? 'eva-done-all-outline' : 'eva-checkmark-outline'));
</script>

<style lang="scss" module>
.message {
  position: relative;
  background-color: v-bind(color);
  border-radius: 10px;
}

.sent {
  &::before {
    position: absolute;
    content: '';
    border: 10px solid transparent;
    border-bottom: 10px solid v-bind(color);
    border-left: 10px solid v-bind(color);
    right: -12px;
    bottom: 0;
  }
}

.recived {
  &::before {
    position: absolute;
    content: '';
    border: 10px solid transparent;
    border-right: 10px solid v-bind(color);
    border-bottom: 10px solid v-bind(color);
    left: -12px;
    bottom: 0;
  }
}

.time {
  font-size: 0.8rem;
  line-height: 0.8rem;
}

.text {
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>
