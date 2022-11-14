<template lang="pug">
button(@click="show") show
div(class="test")
   AlertModal(message="ololo", @show="show", :is-visible="isVisible", type="success")
</template>

<script setup lang="ts">
import AlertModal from '@/components/AlertModal.vue'
import { ref } from 'vue';

const isVisible = ref(false);
function show(){
   isVisible.value = !isVisible.value;
}
</script>


<style lang="scss" scoped>
.test{
   display: flex;
   justify-content: end;
   
}
</style>
