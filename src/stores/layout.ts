import type { ModalContent } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'


export const useLayoutStore = defineStore('layout', () => {
   const header = reactive({
      openLogin: false,
   });
   const account = reactive({
      tab: 'avatar',
   });

   return { header, account };
});