<template lang="pug">
QAvatar(:class="$style.avatar" :size="size" :color="color") {{ avatar ? '': name?.slice(0, 1) }}
   img(v-if="avatar" :src="`${Constants.SERVER_URL}/avatars/${avatar}`")
</template>

<script setup lang="ts">
import { Constants } from '@/util'


withDefaults(defineProps<{
   avatar: string;
   name: string;
   size?: string;
   color?: string;
}>(), { size: '45px', color: 'secondary' });
</script>

<style lang="scss" module>
.avatar{
   color: white;
}
</style>