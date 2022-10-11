import { defineStore } from 'pinia'
import AssistanceService from '@/api/services/AssistanceService'
import { FormsList, HumansList } from '@/intefaces/http'
import { StringObject } from '@/intefaces/interfaces'


export const useHumanStore = defineStore('human', {
   state: () => ({
      info: {
         fio: '',
         error: '',
         isLoading: false,
         isEditable: false,
         currentQuery: '',
         finded: [] as Array<FormsList>,
      },
      list: {
         page: 0,
         total: 0,
         limit: 20,
         isLoading: false,
         humansList: [] as Array<HumansList>,
         selectedSort: '',
      }
   }),
   actions: {
      async findHuman(): Promise<void> {
         try {
            if (!this.info.fio) {
               return;
            }
            const query = this.info.fio.trim().split(' ');
            if (query.length !== 3) {
               throw new Error('Введите ФИО через пробел!');
            }
            this.$patch({
               info: { isLoading: true, isEditable: false, currentQuery: this.info.fio, error: '' }
            });
            const response = await AssistanceService.findHuman(query[0], query[1], query[2]);
            this.info.finded = response.data.humansFormList;
         } catch (e: any) {
            this.info.error = e.message;
         } finally {
            this.info.isLoading = false;
         }
      }
   },
   getters: {
      sortedHumansList(state) {
         return [...state.list.humansList].sort((a: StringObject, b: StringObject) => {
            return a[state.list.selectedSort]?.localeCompare(b[state.list.selectedSort]);
         })
      }
   }
});