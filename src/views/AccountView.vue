<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-my-lg q-pb-lg">Ваш аккаунт</h4>
    <div :class="['row wrap', $style.settings]">
      <div class="q-pa-sm" style="flex: 1">
        <Account.SetAvatar />
      </div>
      <div class="q-px-md" style="flex: 1; min-width: 250px">
        <Account.SetName />
        <Account.SetEmail />
        <Account.SetPassword />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Account from '~/account';
</script>

<style lang="scss" module>
.settings {
  max-width: 600px;
  width: 100%;
}
</style>
