<template>
  <div class="row justify-center items-center" style="height: 70vh">
    <QSkeleton v-if="loading" :class="$style.card" style="height: 280px" />
    <QCard v-else :class="[$style.card, 'q-pa-md']">
      <QCardSection class="row items-center">
        <UserAvatar :name="user?.name" :avatar="user?.avatar" size="120px" />
        <div class="q-ml-lg">
          <h5>
            {{ user?.name }}
            <span v-if="user?.roles.includes('admin')" class="text-caption">(admin)</span>
          </h5>
          <div class="text-overline text-weight-light">
            <QBadge :color="user?.status === 'online' ? 'green' : 'red'">{{ user?.status }}</QBadge>
          </div>
        </div>
      </QCardSection>
      <h6 class="text-indigo text-center">{{ t('userId.messages.info') }}</h6>
      <QCardSection>
        <div>
          <div class="text-subtitle1">{{ t('userId.messages.login') }}</div>
          <QIcon class="text-body1 text-weight-light" name="eva-at-outline" />
          <span class="text-body1 text-weight-light">{{ user?.login }}</span>
        </div>
      </QCardSection>
      <QSeparator />
    </QCard>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue';
import { onMounted } from 'vue';
import { UserService } from '@/api/services';
import { useQuery } from '@/hooks';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const router = useRouter();
const { query, data: user, loading } = useQuery(UserService.show, { onError });

onMounted(() => query(props.id));

function onError() {
  router.push('/');
}
</script>

<style lang="scss" module>
.card {
  max-width: 450px;
  width: 100%;
  min-width: 300px;
}
</style>
