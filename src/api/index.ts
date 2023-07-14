import ky from 'ky';
import { ENV } from '@/util';
import { useStore } from '@/stores';

export const $auth = ky.extend({
  prefixUrl: ENV.API_V1,
  credentials: 'include',
  hooks: {
    beforeRequest: [(request) => request.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)],
  },
});

export const $api = $auth.extend({
  retry: { limit: 2, statusCodes: [401] },
  hooks: {
    beforeRetry: [
      async () => {
        const { refresh } = useStore();
        await refresh();
      },
    ],
  },
});

export const $backend = ky.extend({
  prefixUrl: ENV.SERVER_URL,
});
