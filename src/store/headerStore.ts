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
         this.isModalVisible = false;
         this.isRegVisible = false;
         this.isLogVisible = false;
      }
   }
});
