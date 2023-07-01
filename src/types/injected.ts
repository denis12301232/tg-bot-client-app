import type { Ref, ComputedRef } from 'vue';
import type { ImagesResponse } from './http';

export interface ImageInjected {
  images: Ref<ImagesResponse['images']>;
  total: Ref<number>;
  skip: ComputedRef<number>;
  selected: Ref<Set<string>>;
  uploadModal: Ref<boolean>;
}
