import type { Ref, ComputedRef } from 'vue';
import type { QScrollArea } from 'quasar';
import type { Responses, Streams, IAbonent } from './index';
import type CustomVideo from '@/components/CustomVideo.vue';

export namespace Props {}

export namespace Injected {
  export interface Image {
    images: Ref<Responses.Images['images']>;
    total: Ref<number>;
    skip: ComputedRef<number>;
    selected: Ref<Set<string>>;
    uploadModal: Ref<boolean>;
  }

  export interface RTC {
    videos: Ref<Map<string, InstanceType<typeof CustomVideo> | null>>;
    abonents: Ref<Map<string, IAbonent>>;
    streams: Streams;
  }
}

export namespace Q {
  export interface Pagination {
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
  }

  export interface ScrollEvent {
    ref: QScrollArea;
    verticalPosition: number;
    verticalPercentage: number;
    verticalSize: number;
    verticalContainerSize: number;
    horizontalPosition: number;
    horizontalPercentage: number;
    horizontalSize: number;
    horizontalContainerSize: number;
  }

  export interface PaginationRequest<T = any> {
    limit: number;
    page: number;
    filter: T;
    sort: string;
    descending: boolean;
  }
}
