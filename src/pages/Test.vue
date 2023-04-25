<template>
  <div ref="slider" class="line" tabindex="1" @pointerenter="onPointerenter" >
    <div class="row overflow-auto no-wrap" @scroll="onScroll">
      <div v-for="i in 10" class="img_block">
        <QImg fit="cover" height="50px" width="100px" src="https://cdn.quasar.dev/img/mountains.jpg"></QImg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const slide = ref(1);
const slider = ref<HTMLDivElement | null>(null);

function onPointerenter(){
  console.log('enter');
  slider.value?.focus();
  
}

function onScroll(){
  console.log('scroll');
  
}

</script>

<style lang="scss" scoped>
.line {
  width: 500px;
  &:focus{
    border: 1px solid red;
  }
}
.img_block{
  width: 100px;
  height: 50px;
}
</style>
