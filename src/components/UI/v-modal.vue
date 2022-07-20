<template lang="pug">
.window(
   v-if="show",
   @click="hideWindow",
   @keyup.esc="hideWindow",
   tabindex="0",
   v-focus
)
   .window_content(
      @click.stop,
   )
      slot
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   name: "v-modal",
   props: {
      show: {
         type: Boolean,
         default: false,
      },
   },
   setup(props, { emit }) {

      const hideWindow = (): void => {
         emit("hide");
      };

      return { hideWindow };
   },
});
</script>

<style lang="scss" scoped>
.window {
   top: 0;
   bottom: 0;
   right: 0;
   left: 0;
   background: rgba(0, 0, 0, 0.5);
   position: fixed;
   display: flex;
   z-index: 9999;

   &>.window_content {
      margin: auto;
      border-radius: 12px;
      min-width: 300px;
      min-height: 50px;
      padding: 20px;
      background: white;
      max-height: calc(100vh);
      overflow-y: auto;
      scrollbar-width: thin;
   }
}
</style>