import type { Ref, ComputedRef } from 'vue';
import type { ImagesResponse } from './http';
import type { IAbonent, Streams } from './models';
import type CustomVideo from '~/CustomVideo.vue';

export interface ImageInjected {
  images: Ref<ImagesResponse['images']>;
  total: Ref<number>;
  skip: ComputedRef<number>;
  selected: Ref<Set<string>>;
  uploadModal: Ref<boolean>;
}

export interface RTCInjected {
  videos: Ref<Map<string, InstanceType<typeof CustomVideo> | null>>;
  abonents: Ref<Map<string, IAbonent>>;
  streams: Streams;
}
