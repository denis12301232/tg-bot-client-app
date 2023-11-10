<template>
  <QCard class="full-height">
    <QDialog v-model="modal">
      <QCard :class="$style.invite">
        <QCardSection>
          <h6>{{ t('meetId.invite.title') }}</h6>
        </QCardSection>
        <QCardSection>
          <QInput v-model="query" standout debounce="500" :label="t('meetId.invite.add.placeholder')" />
        </QCardSection>
        <QCardSection>
          <QList>
            <QItem v-for="user of finded" v-ripple class="rounded-borders" clickable :key="user?._id">
              <QItemSection avatar>
                <UserAvatar :name="user?.name" :avatar="user?.avatar" />
              </QItemSection>
              <QItemSection>
                <QItemLabel> {{ user?.name }}</QItemLabel>
                <QItemLabel caption>@{{ user?.login }}</QItemLabel>
              </QItemSection>
              <QItemSection side>
                <QCheckbox v-model="selected" :key="user._id" :val="user._id" />
              </QItemSection>
            </QItem>
          </QList>
          <QBtn v-if="selected.length" v-close-popup class="q-mt-md" color="primary" flat @click="invite">
            {{ t('meetId.buttons.invite') }}
          </QBtn>
        </QCardSection>
      </QCard>
    </QDialog>
    <QCardSection>
      <h6>{{ t('meetId.people.title') }} ({{ users.length }})</h6>
      <QBtn class="q-mt-md" color="primary" flat @click="setModal">{{ t('meetId.buttons.add') }}</QBtn>
    </QCardSection>
    <QSeparator />
    <QCardSection>
      <QList>
        <QItem v-for="user of users" v-ripple class="rounded-borders" clickable :key="user?._id">
          <QItemSection avatar>
            <UserAvatar :name="user?.name" :avatar="user?.avatar" />
          </QItemSection>
          <QItemSection>
            <QItemLabel> {{ user?.name }}</QItemLabel>
            <QItemLabel caption>@{{ user?.login }}</QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { Props } from '@/types';
import UserAvatar from '~/UserAvatar.vue';
import { computed, ref, watch } from 'vue';
import { useStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useQuery } from '@/hooks';
import { UserService, MeetService } from '@/api/services';
import { useRoute } from 'vue-router';

const props = defineProps<Props.Meet.UserList>();
const { t } = useI18n();
const route = useRoute();
const store = useStore();
const modal = ref(false);
const query = ref('');
const selected = ref<string[]>([]);
const users = computed(() => [store.user, ...Array.from(props.abonents.values()).map((a) => a.info)]);
const { query: getUsers, data: finded } = useQuery(UserService.index);

watch(query, () => getUsers({ filter: query.value }));
watch(selected, () => selected.value);

function setModal() {
  modal.value = !modal.value;
}

function invite() {
  MeetService.invite(String(route.params.id), selected.value);
}
</script>

<style lang="scss" module>
.invite {
  max-width: 500px;
  min-width: 300px;
  width: 100%;
}
</style>
