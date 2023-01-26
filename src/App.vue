<template lang="pug">
LoaderPage(:loading="store.isPageLoading")
ModalAlert(
   class="alert" 
   :type="store.alert.type" 
   :message="store.alert.message" 
   :visible="store.alert.visible"
   @show="store.alert.visible = !store.alert.visible"
   )
RouterView
</template>

<script setup lang="ts">
import ModalAlert from '~/ModalAlert.vue'
import LoaderPage from '~/LoaderPage.vue'
import { onMounted } from 'vue'
import { useStore } from '@/stores'
import { useTelegram } from '@/hooks'


const store = useStore();
const { tg, isOpenedFromTg, theme } = useTelegram();

onMounted(() => {
   tg.ready();
   if (isOpenedFromTg) {
      store.theme = theme;
   }
   if (localStorage.getItem('token')) {
      store.refresh();
   }
});
</script>

<style scoped lang="scss">
.alert {
   top: 55px;
   right: 5px;
}
</style>
