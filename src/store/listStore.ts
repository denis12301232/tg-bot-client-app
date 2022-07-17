import { defineStore } from 'pinia'
import UserDataService from '@/api/services/UserDataService';

export const useListStore = defineStore('list', {
   state: () => ({
      page: 0,
      total: 0,
      limit: 10,
      error: '',
      isLoading: false,
      humansList: <Array<string>>[],
   }),
   actions: {
      async catchHumansList() {
         try {
            this.error = '';
            this.page++;
            this.isLoading = true;
            const response = await UserDataService.catchHumansList({ limit: this.limit, page: this.page });
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
