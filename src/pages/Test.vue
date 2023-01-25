<template lang="pug">
ModalAlert(message="olololofffffffffff fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" type="success" :visible="true" @show="visible = !visible")
QBtn(@click="visible = !visible") ttt
</template>


<script setup lang="ts">
import ModalAlert from '~/ModalAlert.vue';
import { ref } from 'vue';



const visible = ref(false);


</script>