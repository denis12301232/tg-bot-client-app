import { getCurrentInstance, computed } from 'vue';

export default function useVModel<T>(m = 'modelValue') {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error('Instance not exists');
  }
  const emit = instance.emit;

  return computed<T>({
    get() {
      return instance.props[m] as T;
    },
    set(v) {
      emit(`update:${m}`, v);
    },
  });
}
