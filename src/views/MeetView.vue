<template>
  <div class="column items-center q-pa-sm">
    <form class="meet q-mt-lg column items-center" @submit.prevent="createNewMeet">
      <h5 class="text-center">{{ t('meets.create.title') }}</h5>
      <QInput
        v-model="meetTitle"
        class="q-my-md full-width"
        :label="t('meets.create.form.fields.title.placeholder')"
        standout
      />
      <QBtn :disable="!meetTitle" color="primary" type="submit">
        {{ t('meets.create.form.buttons.create') }}
      </QBtn>
    </form>
    <form class="meet q-mt-lg column items-center" @submit.prevent="joinMeet">
      <h5 class="text-center">{{ t('meets.join.title') }}</h5>
      <QInput
        v-model="meetId"
        class="q-my-md full-width"
        :label="t('meets.join.form.fields.meetId.placeholder')"
        standout
      />
      <QBtn :disable="!meetId" color="primary" type="submit">
        {{ t('meets.join.form.buttons.join') }}
      </QBtn>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { IMeet } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { MeetService } from '@/api/services';

const { t } = useI18n();
const router = useRouter();
const meetTitle = ref('');
const meetId = ref('');

function createNewMeet() {
  MeetService.create({ title: meetTitle.value, invited: [] })
    .json<IMeet>()
    .then((meet) => router.push({ path: `/meets/${meet._id}` }));
}

function joinMeet() {
  router.push({ path: `/meets/${meetId.value}` });
}
</script>

<style lang="scss" scoped>
.meet {
  max-width: 500px;
  width: 100%;
}
</style>
