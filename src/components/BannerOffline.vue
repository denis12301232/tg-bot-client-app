<template>
  <div class="row justify-center position-relative">
    <Transition name="slide-fade">
      <QBanner
        v-if="!online"
        class="bg-orange text-white z-max absolute-top"
        rounded
        style="width: 50%; left: 50%; transform: translate(-50%, 0)"
      >
        {{ t('extra.offline.messages.offline') }}
        <template #action>
          <QBtn @click="onClose">{{ t('extra.offline.buttons.close') }}</QBtn>
        </template>
        <template #avatar>
          <QIcon name="eva-wifi-off" />
        </template>
      </QBanner>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useOnline } from '@/hooks';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const online = useOnline();

function onClose() {
  online.value = true;
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.8s ease-in;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>
