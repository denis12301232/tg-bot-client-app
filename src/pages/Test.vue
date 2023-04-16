<template>
<CallVideo :stream="stream"></CallVideo>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CallVideo from '~/CallVideo.vue';

const stream = ref<MediaStream>()

onMounted(() => {
   navigator.mediaDevices.getDisplayMedia({video: true}).then((s) => {
      stream.value = s;
   })
});
</script>

<style lang="scss" module>

</style>
