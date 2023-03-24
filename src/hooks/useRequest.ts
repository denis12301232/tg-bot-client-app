import type { Pagination } from '@/types';
import { ref } from 'vue';


interface RequestProps {
   f: (args: { page: number, limit: number, filter: any, sort: string, descending: boolean }) => any;
   limit?: number;
   page?: number;
   sort?: string;
   descending?: boolean;
}

export default function useRequest<T>({ f, limit = 10, page = 1, sort = '', descending = true }: RequestProps) {
   const loading = ref(false);
   const error = ref('');
   const data = ref<T[]>([]);
   const filter = ref('');
   const pagination = ref({
      sortBy: sort,
      descending: descending,
      page: page,
      rowsPerPage: limit, // limit
      rowsNumber: 0, // total
   });

   async function onRequest(props: { pagination: Pagination; filter?: any }) {
      try {
         loading.value = true;
         const { page, rowsPerPage, sortBy, descending } = props.pagination;
         const response = await f({ page: page, limit: rowsPerPage, filter: props.filter, sort: sortBy, descending });
         data.value.splice(0, data.value.length, ...response.data);
         pagination.value = { ...props.pagination, rowsNumber: Number(response.headers['x-total-count']) };
      } catch (e: any) {
         error.value = e.message
      } finally {
         loading.value = false;
      }
   }

   return { loading, error, data, filter, pagination, onRequest }
}