<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/')" />
        <QToolbarTitle>{{ t('gallery.layout.title') }}</QToolbarTitle>
        <QBtnGroup v-if="store.isAdmin" flat>
          <GalleryImageDelete :selected="selected" />
          <QBtn icon="eva-upload-outline" dense flat round color="green" @click="openModal" />
        </QBtnGroup>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import GalleryImageDelete from '~/gallery/GalleryImageDelete.vue';
import type { ImagesResponse } from '@/types';
import { ref, provide, computed } from 'vue';
import { useStore } from '@/stores';
import { useI18nT } from '@/hooks';

const { t } = useI18nT();
const store = useStore();
const images = ref<ImagesResponse['images']>([]);
const total = ref(0);
const selected = ref(new Set<string>());
const uploadModal = ref(false);
const skip = computed(() => images.value.length);

provide('data', { images, total, skip, selected, uploadModal });

function openModal() {
  uploadModal.value = true;
}
</script>
