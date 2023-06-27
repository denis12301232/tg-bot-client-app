<template>
  <QLayout view="hHh lpR fFf">
    <QHeader class="header" reveal elevated height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="eva-arrow-back" color="primary" @click="$router.push('/')" />
        <QToolbarTitle>{{ t('gallery.layout.title') }}</QToolbarTitle>
        <QBtnGroup v-if="store.isAdmin" flat>
          <GalleryImageDelete :selected="selected" />
          <GalleryImageUpload />
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
import GalleryImageUpload from '~/gallery/GalleryImageUpload.vue';
import type { I18n, Langs, ImagesResponse } from '@/types';
import { ref, provide, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/stores';

const { t } = useI18n<I18n, Langs>();
const store = useStore();
const images = ref<ImagesResponse['images']>([]);
const total = ref(0);
const selected = ref(new Set<string>());
const skip = computed(() => images.value.length);

provide('data', { images, total, skip, selected });
</script>