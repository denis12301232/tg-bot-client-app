import { getCurrentInstance, computed } from 'vue';

export default function useVModel<T>(m?: string) {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error('Instance not exists');
  }
  const emit = instance.emit;

  return computed<T>({
    get() {
      return instance.props[m || 'modelValue'] as T;
    },
    set(v) {
      emit(`update:${m || 'modelValue'}`, v);
    },
  });
}
