<template>
  <QCard class="column">
    <QCardSection class="row items-center">
      <QBtn v-close-popup dense flat round icon="eva-arrow-back-outline" color="primary" />
      <h6>{{ t('imageComments.title') }}</h6>
    </QCardSection>
    <QScrollArea
      class="flex-auto q-pa-md"
      :thumb-style="{ width: '7px' }"
      :content-style="style"
      :content-active-style="style"
    >
      <QCard class="full-width" style="max-width: 600px">
        <QIntersection v-for="comment of comments" :key="comment._id" transition="scale" once @visibility="onVisible">
          <QItem>
            <QItemSection avatar>
              <UserAvatar :avatar="comment.user.avatar" :name="comment.user.name" />
            </QItemSection>
            <QItemSection>
              <QItemLabel caption lines="2">
                <span class="text-subtitle2 text-black">{{ comment.user.login }}</span>
                {{ comment.text }}
              </QItemLabel>
              <QItemLabel caption>
                {{ d(comment.createdAt, 'time') }}
                <span v-if="comment.reactions.length">
                  {{ t('imageComments.messages.likes', comment.reactions.length) }}
                </span>
              </QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QBtn
                dense
                flat
                round
                :icon="comment.reactions.includes(store.user?._id || '') ? 'eva-heart' : 'eva-heart-outline'"
                :color="comment.reactions.includes(store.user?._id || '') ? 'red' : ''"
                @click="likeComment(comment._id)"
              />
            </QItemSection>
          </QItem>
        </QIntersection>
      </QCard>
    </QScrollArea>
    <div class="row justify-center q-py-sm">
      <QInput
        v-model="comment"
        ref="inputRef"
        class="full-width"
        style="max-width: 600px"
        filled
        maxlength="300"
        counter
        :label="t('imageComments.messages.input')"
        @keyup.enter="onKeyup"
      >
        <template #prepend>
          <EmojiPicker
            :color="store.currentTheme === 'dark' ? 'white' : ''"
            @pick="onPickEmoji"
            @hide="inputRef?.$el.focus()"
          />
        </template>
        <template #append>
          <QBtn
            dense
            flat
            round
            icon="eva-paper-plane-outline"
            style="transform: rotate(41deg)"
            :disable="!comment.length"
            @click="saveComment(id, comment)"
          />
        </template>
      </QInput>
    </div>
  </QCard>
</template>

<script setup lang="ts">
import type { IComment, Props } from '@/types';
import type { QInput, VueStyleProp } from 'quasar';
import UserAvatar from '~/UserAvatar.vue';
import EmojiPicker from '~/EmojiPicker.vue';
import { onMounted, ref, computed } from 'vue';
import { useQuery } from '@/hooks';
import { ImageService } from '@/api/services';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/stores';

const props = defineProps<Props.Gallery.ImageComments>();
const store = useStore();
const { t, d } = useI18n();
const { query: getComments, loading } = useQuery(ImageService.getComments, { onSuccess: onGetCommentsSuccess });
const { query: saveComment } = useQuery(ImageService.saveComment, { onFinally, onSuccess });
const inputRef = ref<QInput | null>(null);
const comment = ref('');
const comments = ref<IComment[]>([]);
const total = ref(0);
const skip = computed(() => comments.value.length);
const style: VueStyleProp = {
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

onMounted(() => getComments(props.id, { skip: skip.value, limit: 15, descending: false, sort: 'createdAt' }));

function onFinally() {
  comment.value = '';
}

function onGetCommentsSuccess(data: Awaited<ReturnType<typeof ImageService.getComments>>) {
  comments.value = comments.value.concat(data.comments);
  total.value = data.count;
}

function onSuccess(comment: Awaited<ReturnType<typeof ImageService.saveComment>>) {
  comments.value.push({ ...comment, user: store.user! });
  total.value++;
}

function onVisible() {
  if (total.value === comments.value.length || loading.value) {
    return;
  }
  getComments(props.id, { skip: skip.value, limit: 15, descending: false, sort: 'createdAt' });
}

function likeComment(id: string) {
  const comment = comments.value.find((comment) => comment._id === id);
  comment?.reactions.includes(store.user?._id || '')
    ? (comment.reactions = comment.reactions.filter((item) => item !== store.user?._id))
    : comment?.reactions.push(store.user?._id || '');

  ImageService.updateComment(id, { reactions: comment?.reactions || [] });
}

function onPickEmoji(emoji: string) {
  comment.value = comment.value + emoji;
}

function onKeyup() {
  if (!comment.value) {
    return;
  }
  saveComment(props.id, comment.value);
}
</script>
