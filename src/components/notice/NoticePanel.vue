<template>
  <div :class="$style.container">
    <div v-if="alertStore.notices.size" class="flex-auto">
      <QScrollArea
        class="fit"
        :thumb-style="{ width: '7px' }"
        :content-style="{ position: 'relative', overflow: 'hidden' }"
        :content-active-style="{ position: 'relative', overflow: 'hidden' }"
      >
        <QList class="q-pa-sm column reverse">
          <QSlideItem
            v-for="n in alertStore.notices.values()"
            class="q-mb-sm"
            left-color="transparent"
            @left="clearOne(n.id)"
            :key="n.id"
          >
            <template v-slot:left> </template>
            <QItem :class="[$style.item, 'shadow-1', 'full-width']" clickable>
              <div class="row items-top justify-between full-width no-wrap">
                <div :class="[$style.title, 'text-subtitle2']">{{ n.title }}</div>

                <div class="row no-wrap items-top">
                  <div class="text-caption">{{ d(n.time, 'time') }}</div>
                  <div :class="$style.close" style="width: 10px; height: 10px">
                    <QBtn round dense flat icon="eva-close" size="10px" @click="clearOne(n.id)" />
                  </div>
                </div>
              </div>
              <div class="text-body2 text-weight-light break-word">{{ n.text }}</div>
            </QItem>
          </QSlideItem>
        </QList>
      </QScrollArea>
    </div>
    <div v-else class="text-center text-h6 q-py-md text-negative">
      {{ t('home.menu.notice.title') }}
    </div>
    <div class="row justify-between q-pa-sm">
      <QBtn
        :icon="alertStore.muted ? 'eva-bell-off-outline' : 'eva-bell-outline'"
        color="deep-orange"
        round
        dense
        flat
        @click="alertStore.setMuted"
      />
      <QBtn :disable="Boolean(!alertStore.notices.size)" color="negative" flat @click="clearAll">
        {{ t('home.menu.notice.buttons.clear') }}
      </QBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NoticeService } from '@/api/services';
import { useAlertStore } from '@/stores';
import { useI18n } from 'vue-i18n';

const { t, d } = useI18n();
const alertStore = useAlertStore();

function clearAll() {
  alertStore.notices.clear();
  NoticeService.clear();
}

function clearOne(id: string) {
  alertStore.notices.delete(id);
  NoticeService.destroy(id);
}
</script>

<style lang="scss" module>
.container {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}
.item {
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  &:hover {
    .close {
      display: inline-block;
    }
  }

  & .close {
    display: none;
  }
}

.title {
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px 0 0;
}
</style>
