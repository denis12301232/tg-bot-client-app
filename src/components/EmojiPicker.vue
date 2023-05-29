<template>
  <QBtnDropdown
    dropdown-icon="eva-smiling-face-outline"
    rounded
    flat
    dense
    menu-anchor="bottom start"
    menu-self="top start"
  >
    <QScrollArea
      class="q-px-sm q-pb-sm"
      style="height: 300px; min-width: 250px"
      id="scroll-area-with-virtual-scroll-1"
      :thumb-style="{ width: '5px' }"
    >
      <QVirtualScroll
        #default="{ item, index }: { item: { [name: string]: { [name: string]: string } }, index: number }"
        scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
        :items="emojiArray"
        separator
      >
        <div class="text-caption text-weight-bold q-py-sm" :key="index">{{ item[0] }}</div>
        <div :class="$style.emojies" :key="index">
          <QIcon
            v-for="[k, v] in Object.entries(item[1])"
            :key="k"
            tag="btn"
            size="20px"
            role="emoji"
            :class="$style.icon"
            @click="emit('pick', v)"
          >
            {{ v }}
          </QIcon>
        </div>
      </QVirtualScroll>
    </QScrollArea>
  </QBtnDropdown>
</template>

<script setup lang="ts">
import { Constants } from '@/util';

const emit = defineEmits<{
  (event: 'pick', emoji: string): void;
}>();

const emojiArray = Object.entries(Constants.emoji);
</script>

<style module lang="scss">
.emojies {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;

  & .emojies_item {
    font-size: 1.3em;
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'NotoColorEmoji', 'Segoe UI Symbol', 'Android Emoji',
      'EmojiSymbols';
  }

  & .icon {
    width: 100%;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
