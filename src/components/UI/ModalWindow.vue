<template lang="pug">
Transition(name="fade")
   div(
      :class="[$style.window, dark ? $style.window_dark : $style.window_light]",
      @keyup.esc="hideWindow",
      @click="hideWindow",
      tabindex="0",
      v-if="show",
      v-focus,
   )
      div(:class="$style.window_content", @click.stop)
         slot
</template>

<script setup lang="ts">
import { useTheme } from "@/hooks/useTheme"

defineProps({
   show: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['hide']);
const { dark } = useTheme();

const hideWindow = (): void => {
   emit("hide");
};
</script>

<style lang="scss" module>
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
      max-height: calc(100vh);
      overflow-y: auto;
      scrollbar-width: thin;
   }
}

.window_light {
   & .window_content {
      background-color: var(--background-color-light);
   }

}

.window_dark {
   & .window_content {
      background-color: #131314;
   }
}

.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}
</style>