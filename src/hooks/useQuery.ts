import type { MaybePromise } from '@/types';
import { ref, type Ref } from 'vue';
import type { HTTPError } from 'ky';

interface LifetimeHooks<T extends (...args: Parameters<T>) => ReturnType<T>> {
  onSuccess?: (v: Awaited<ReturnType<T>>) => MaybePromise<void>;
  onError?: (e: HTTPError) => MaybePromise<void>;
  onFinally?: () => MaybePromise<void>;
}

export default function useQuery<T extends (...args: Parameters<T>) => ReturnType<T>>(
  request: T,
  hooks?: LifetimeHooks<T>
) {
  const data: Ref<Awaited<ReturnType<T>> | null> = ref(null);
  const loading = ref(false);
  const error = ref<HTTPError | null>(null);

  async function query(...args: Parameters<T>) {
    loading.value = true;
    Promise.resolve(request(...args))
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);
  }

  function onSuccess(v: Awaited<ReturnType<T>>) {
    data.value = v;
    hooks?.onSuccess && hooks.onSuccess(v);
  }

  function onError(e: HTTPError) {
    error.value = e;
    hooks?.onError && hooks.onError(e);
  }

  function onFinally() {
    loading.value = false;
    hooks?.onFinally && hooks.onFinally();
  }

  return { data, loading, error, query };
}
