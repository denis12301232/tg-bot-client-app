<template lang="pug">
//v-calendar
v-burger(@click.stop="setVisible", :is-selected="test")
div(v-if="test") gfdggggggggggggggggggggggggggggggggsewrrrrrrrrrrrrrr
</template>

<script setup lang="ts">
import { ref } from 'vue';

const test = ref(false);

function setVisible(){
   console.log('test');
   
   test.value = !test.value;
}
</script>


<style lang="scss" module>
</style>