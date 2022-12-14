import { defineStore } from 'pinia'
import { HumansList } from '@/interfaces/http'
import { StringObject } from '@/interfaces/interfaces'


export const useHumanStore = defineStore('human', {
   state: () => ({
      list: {
         page: 0,
         total: 0,
         limit: 20,
         isLoading: false,
         humansList: [] as HumansList[],
         selectedSort: null as string | null,
         searchQuery: '',
      }
   }),
   getters: {
      sortedHumansList(state): HumansList[] {
         if (typeof state.list.selectedSort === 'string') {
            return [...state.list.humansList].sort((a: StringObject, b: StringObject) => {
               return a[state.list.selectedSort as string]?.localeCompare(b[state.list.selectedSort as string]);
            });
         } else {
            return state.list.humansList;
         }
      },
      sortedAndSearchedHumansList(): HumansList[] {
         return [...this.sortedHumansList].filter(item => {
            return item.fio.includes(this.list.searchQuery);
         });
      }
   }
});