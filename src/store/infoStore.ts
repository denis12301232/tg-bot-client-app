import { defineStore } from 'pinia'
import AssistanceService from '@/api/services/AssistanceService';
import { AssistanceForm } from "@/intefaces/AssistanceForm";

export const useInfoStore = defineStore('info', {
   state: () => ({
      fio: '',
      error: '',
      isListLoading: false,
      isEditable: false,
      finded: <Array<{ form: AssistanceForm, _id: string }>>[],
   }),
   actions: {
      async findHuman(): Promise<void> {
         try {
            if (!this.fio) {
               return;
            }
            this.isListLoading = true;
            this.isEditable = false;
            this.error = "";
            const response = await AssistanceService.findHuman(this.fio.trim());
            this.finded = response.data.humansFormList;
            if (!this.finded.length) {
               this.error = `Ничего не найдено по запросу ${this.fio}`;
            }
         }
         catch (e: any) {    
            this.error = e.message;
         }
         finally {
            this.isListLoading = false;
         }
      },
   },
});
