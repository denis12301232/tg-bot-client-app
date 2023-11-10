<template>
  <Transition name="menu">
    <div v-if="visible" class="menu">
      <QCard class="full-height" square>
        <QCardSection class="text-center text-h5">{{ t('chat.menu.left.title') }}</QCardSection>
        <QSeparator />
        <QList class="q-px-sm q-pt-sm">
          <QItem v-ripple clickable tag="a" to="/">
            <QItemSection avatar>
              <QIcon name="eva-home-outline" color="primary" />
            </QItemSection>
            <QItemSection class="text-uppercase">{{ t('chat.menu.left.home') }}</QItemSection>
          </QItem>
          <QItem v-ripple clickable tag="a" to="/account">
            <QItemSection avatar>
              <QIcon name="eva-person-outline" color="primary" />
            </QItemSection>
            <QItemSection class="text-uppercase">{{ t('chat.menu.left.account') }}</QItemSection>
          </QItem>
          <QItem v-ripple v-close-popup clickable @click="emit('modal', 'modal:group-create')">
            <QItemSection avatar>
              <QIcon name="eva-plus-square-outline" color="primary" />
            </QItemSection>
            <QItemSection class="text-uppercase">{{ t('chat.menu.left.group') }}</QItemSection>
          </QItem>
        </QList>
      </QCard>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Extra, Props } from '@/types';
import { useI18n } from 'vue-i18n';



defineProps<Props.Chat.LeftMenu>();
const emit = defineEmits<{ modal: [name: Extra.Chat.ModalName] }>();
const { t } = useI18n();
</script>

<style scoped lang="scss">
.menu {
  max-width: 307px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1000;
}

.menu-enter-active {
  transition: all 0.3s ease-out;
}

.menu-leave-active {
  transition: all 0.3s ease-out;
}

.menu-enter-from,
.menu-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.divider {
  border-right: 1px solid #636363;
}
</style>
