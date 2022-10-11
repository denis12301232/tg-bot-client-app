import { useStore } from "@/store/mainStore"
import { computed } from "@vue/reactivity"

export function useTheme() {
   const store = useStore();
   const light = computed(() => store.currentTheme === "light" ? true : false);
   const dark = computed(() => store.currentTheme === "dark" ? true : false);

   return { light, dark }
}