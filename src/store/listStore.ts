import { defineStore } from 'pinia'
import AssistanceService from '@/api/services/AssistanceService'

export const useListStore = defineStore('list', {
   state: () => ({
      page: 0,
      total: 0,
      limit: 20,
      error: '',
      isLoading: false,
      humansList: <Array<{ fio: string, _id: string }>>[],
   }),
   actions: {
      async catchHumansList(): Promise<void> {
         try {
            this.error = '';
            this.page++;
            this.isLoading = true;
            const response = await AssistanceService.catchHumansList({ limit: this.limit, page: this.page });
            this.total = Math.ceil(+response.headers['x-total-count'] / this.limit);
            this.humansList = [...this.humansList, ...response.data.humansList];
            if (!this.humansList.length) this.error = "Список пуст";

         } catch (e: any) {
            this.error = e.message;
         } finally {
            this.isLoading = false;
         }
      }
   },
});
