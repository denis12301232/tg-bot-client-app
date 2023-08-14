<template>
  <div :class="$style.container">
    <div :class="['row', 'items-end', 'no-wrap', sent ? '' : 'reverse']">
      <div style="max-width: 280px; width: 100%">
        <div class="relative-position" style="max-width: 280px; width: 100%">
          <div :class="[$style.images, 'shadow-1']">
            <QImg
              v-for="link in links"
              :class="$style.wrapper"
              :img-class="$style.img"
              :key="link"
              :src="link"
              :ratio="4 / 3"
              @click="emit('open', link)"
            >
              <template #loading>
                <LoaderWheel size="35px" />
              </template>
            </QImg>
          </div>
          <QBadge class="absolute-bottom-right" color="grey-10" rounded transparent>
            {{ d(time, 'time') }}
            <QTooltip :delay="1000">{{ d(time, 'short') }}</QTooltip>
          </QBadge>
        </div>
        <slot name="reactions" />
      </div>

      <slot name="avatar" :classes="sent ? 'q-ml-sm' : 'q-mr-sm'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoaderWheel from '@/components/LoaderWheel.vue';
import { ref, computed, onMounted } from 'vue';
import { useGetTempUrl } from '@/hooks';
import { useI18n } from 'vue-i18n';

interface Props {
  images: string[];
  time: Date | string;
  sent: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ open: [link: string] }>();
const { d } = useI18n();
const imgs = ref(props.images.map((image) => useGetTempUrl(image, 'image/*')));
const links = computed(() => imgs.value.map((img) => img.src));

onMounted(() => imgs.value.forEach((img) => img.getUrl()));
</script>

<style lang="scss" module>
.container {
  max-width: 350px;
  width: 100%;
}

.images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  max-width: 280px;
  width: 100%;
  border-radius: 10px;
  justify-content: center;
  overflow: hidden;

  & .wrapper {
    max-width: 300px;
    max-height: 400px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    overflow: hidden;

    &:last-child:nth-child(2n -1) {
      grid-column: 1 / -1;
    }
  }
}

.img {
  &:hover {
    transition: transform 2s ease;
    transform: scale(1.1);
  }
}
</style>
