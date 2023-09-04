<template>
  <div class="row justify-center items-center">
    <QCard :class="[$style.card, 'q-pa-md']">
      <QCardSection class="row justify-center">
        <UserAvatar :name="user?.name" :avatar="user?.avatar" size="120px" />
      </QCardSection>
      <QCardSection class="row justify-center">
        <h5>
          {{ user?.name }}
          <span v-if="user?.roles.includes('admin')" class="text-caption">(admin)</span>
        </h5>
      </QCardSection>
      <QCardSerction class="row justify-center text-overline text-weight-light">
        {{ user?.status }}
      </QCardSerction>
    </QCard>
  </div>
</template>

<script setup lang="ts">
import type { IUser } from '@/types';
import UserAvatar from '@/components/UserAvatar.vue';
import { onMounted, watch } from 'vue';
import { UserService } from '@/api/services';
import { useFetch } from '@/hooks';
import { useRouter } from 'vue-router';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const router = useRouter();
const { request, data: user, loading, error } = useFetch<IUser, (typeof UserService)['getUser']>(UserService.getUser);

onMounted(() => request(props.id));
watch(error, () => router.push('/'));
</script>

<style lang="scss" module>
.card {
  max-width: 450px;
  width: 100%;
  min-width: 300px;
}
</style>
