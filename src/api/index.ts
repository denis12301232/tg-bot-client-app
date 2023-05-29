import ky from 'ky';
import { ENV } from '@/util';
import { useStore } from '@/stores';

export const $api = ky.extend({
  prefixUrl: ENV.API_V1,
  credentials: 'include',
  retry: { limit: 2, statusCodes: [401] },
  hooks: {
    beforeRequest: [(request) => request.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)],
    beforeRetry: [
      async ({ request, error, options, retryCount }) => {
         const store = useStore();
         await store.refresh();
      },
    ],
  },
});
