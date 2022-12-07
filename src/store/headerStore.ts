import { defineStore } from 'pinia'

export const useHeaderStore = defineStore('header', {
   state: () => ({
      isHeaderMenuVisible: false,
      isUserMenuVisible: false,
      isModalVisible: false,
      isLogVisible: false,
      isRegVisible: false,
   }),
   actions: {
      hideWindow(): void {
         this.$patch({ isModalVisible: false, isRegVisible: false, isLogVisible: false });
      }
   },
});
