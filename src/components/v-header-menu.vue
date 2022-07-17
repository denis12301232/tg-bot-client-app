<template lang="pug">
div.buttons
   v-button(@click="changeRoute('/')") Внести данные
   v-button(@click="changeRoute('/list')") Полный список
   v-button(@click="changeRoute('/info')") Информация по человеку
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useHeaderStore } from "@/store/headerStore"
import { useRouter } from 'vue-router'

export default defineComponent({
   name: "v-header-menu",
   setup() {
      const router = useRouter();
      const headerStore = useHeaderStore();

      const changeRoute = (route: string): void => {
         headerStore.isHeaderMenuVisible = false;
         router.push(route);
      }

      return { changeRoute }
   }

})
</script>


<style lang="scss" scoped>
.buttons {
   width: 120px;
   display: flex;
   flex-direction: column;
   background-color: white;
   padding: 5px;

   & button:not(:first-child) {
      margin-top: 5px;
   }
}
</style>