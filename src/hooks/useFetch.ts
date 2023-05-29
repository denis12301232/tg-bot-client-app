import { ref, type Ref } from 'vue';
import { HTTPError, type ResponsePromise, type KyResponse } from 'ky';

interface Opts<T> {
  beforeRequest?: (...args: unknown[]) => unknown;
  afterResponse?: (opts: { response: KyResponse; data: Ref<T> }) => unknown;
  afterSuccess?: (opts: { response: KyResponse; data: Ref<T> }) => unknown;
  type?: 'json' | 'blob';
}

export default function useFetch<
  T,
  S extends (...args: Parameters<S>) => ResponsePromise = (...args: any[]) => ResponsePromise
>(f: S, opts: Opts<T> = { type: 'json' }) {
  const loading = ref(false);
  const error = ref<string | { message: string; errors: unknown[] }>('');
  const data = ref<T>();
  let response: KyResponse;

  async function request(...args: Parameters<S>) {
    try {
      opts?.beforeRequest && opts.beforeRequest();
      loading.value = true;
      response = await f(...args);
      switch (opts.type) {
        case 'json':
          data.value = await response.json<T>();
          break;
        case 'blob':
          break;
        default:
          data.value = await response.json<T>();
          break;
      }
      opts.afterSuccess && opts.afterSuccess({ response, data: data as Ref<T> });
    } catch (e) {
      if (e instanceof HTTPError) {
        error.value = await e.response.json();
        response = e.response;
      } else if (e instanceof Error) {
        error.value = e.message;
      }
    } finally {
      loading.value = false;
      opts?.afterResponse && opts.afterResponse({ response, data: data as Ref<T> });
    }
  }

  return { request, data, loading, error };
}
