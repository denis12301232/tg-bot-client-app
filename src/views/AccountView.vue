<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-my-lg q-pb-lg">{{ t('account.title') }}</h4>
    <div :class="['row wrap', $style.settings]">
      <div class="q-pa-sm" style="flex: 1">
        <Account.SetAvatar :label="t('account.buttons.set')" />
      </div>
      <div class="q-px-md" style="flex: 1; min-width: 250px">
        <Account.SetName :label="t('account.placeholders.email')" />
        <Account.SetEmail :label="t('account.placeholders.name')" />
        <Account.SetPassword
          :label="{
            old: t('account.placeholders.oldPassword'),
            new: t('account.placeholders.newPassword'),
            button: t('account.buttons.set'),
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Account from '~/account';
import type { I18n, Langs } from '@/types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n<I18n, Langs>({ useScope: 'global' });
</script>

<style lang="scss" module>
.settings {
  max-width: 600px;
  width: 100%;
}
</style>
