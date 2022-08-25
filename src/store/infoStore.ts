import { defineStore } from 'pinia'
import AssistanceService from '@/api/services/AssistanceService';
import { AssistanceForm } from "@/intefaces/interfaces";

export const useInfoStore = defineStore('info', {
   state: () => ({
      fio: '',
      error: '',
      isListLoading: false,
      isEditable: false,
      finded: <Array<{ form: AssistanceForm, _id: string }>>[],
      currentQuery: '',
      currentScrollY: 0,
   }),
   actions: {
      async findHuman(): Promise<void> {
         try {
            if (!this.fio) {
               return;
            }
            const fio = this.fio.trim().split(' ');
            if (fio.length !== 3) {
               throw new Error('Введите ФИО через пробел!');
            }
            this.currentQuery = this.fio;
            this.isListLoading = true;
            this.isEditable = false;
            this.error = "";
            const response = await AssistanceService.findHuman(fio[0], fio[1], fio[2]);
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
