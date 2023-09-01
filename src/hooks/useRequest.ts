import type { Q } from '@/types';
import { type ResponsePromise, HTTPError } from 'ky';
import { ref, type Ref } from 'vue';

interface Opts {
  limit?: number;
  page?: number;
  sort?: string;
  descending?: boolean;
  filters?: any;
}

export default function useRequest<T>(
  f: (args: Q.PaginationRequest) => ResponsePromise,
  { limit = 10, page = 1, sort = '', descending = true, filters }: Opts = {}
) {
  const loading = ref(false);
  const error = ref('');
  const filter = ref(filters);
  const data = ref<T[]>([]) as Ref<T[]>;
  const pagination = ref({
    sortBy: sort,
    descending: descending,
    page: page,
    rowsPerPage: limit, // limit
    rowsNumber: 0, // total
  });

  async function request(props: { pagination: Q.Pagination; filter?: any }) {
    try {
      loading.value = true;
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const response = await f({
        page: page,
        limit: rowsPerPage,
        filter: props.filter || '',
        sort: sortBy,
        descending,
      });
      data.value = await response.json<T[]>();
      pagination.value = { ...props.pagination, rowsNumber: Number(response.headers.get('x-total-count')) };
    } catch (e) {
      if (e instanceof HTTPError) {
        error.value = await e.response.json();
      } else if (e instanceof Error) {
        error.value = e.message;
      }
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, data, filter, pagination, request };
}
