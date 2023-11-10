import type { Ref, ComputedRef } from 'vue';
import type { QScrollArea } from 'quasar';
import type { Responses, Streams, IAbonent, IAlert, INotice, ITask, ISubtask } from './index';
import type CustomVideo from '@/components/CustomVideo.vue';

export namespace Props {
  export namespace Account {
    export interface SetAvatar {
      label: string;
      successMsg: string;
    }
  }

  export namespace Alert {
    export interface List {
      modelValue: IAlert[];
    }

    export interface Message {
      alert: IAlert;
      icon: string;
    }
  }

  export namespace Chat {
    export interface DialogHeader {
      type: 'dialog' | 'group';
    }

    export interface DialogMessages {
      type: 'dialog' | 'group';
    }

    export interface GroupCreate {
      onCloseModal: () => void;
    }

    export interface LeftMenu {
      visible: boolean;
    }

    export interface ListSearch {
      modelValue: string;
    }

    export interface Message {
      text?: string;
      read?: boolean;
      time: Date | string;
      sent?: boolean;
      color?: string;
    }

    export interface MessageImage {
      images: string[];
      time: Date | string;
      sent: boolean;
    }

    export interface MessageVoice {
      filename: string;
    }

    export interface ModalImage {
      src: string;
    }
  }

  export namespace Gallery {
    export interface ImageComments {
      id: string;
    }

    export interface ImageFull {
      currentIndex: number;
      total: number;
      images: Responses.Images['images'];
      loading: boolean;
    }

    export interface ImageList {
      loading: boolean;
      error: string;
    }
  }

  export namespace List {
    export interface Export {
      ids: string[];
    }

    export interface Filters {
      query: {
        district: string;
        street: string;
        sector: string;
        birth: {
          min: number;
          max: number;
        };
      };
      criterias: ('district' | 'birth' | 'street' | 'sector')[];
    }
  }

  export namespace Meet {
    export interface Chat {
      abonents: Map<string, IAbonent>;
      messages: { userId: string; msg: string }[];
    }

    export interface Info {
      link: string;
      title: string;
    }

    export interface UserList {
      abonents: Map<string, IAbonent>;
    }
  }

  export namespace Notice {
    export interface Item {
      notice: INotice;
    }

    export interface List {
      modelValue: Map<string, INotice>;
    }
  }

  export namespace Stats {
    export interface Assistance {
      label: string;
      by: 'month' | 'year';
    }
  }

  export namespace Tasks {
    export interface ModalMove {
      taskId: string;
      subtaskId: string;
    }

    export interface Task {
      task?: ITask;
    }

    export interface Subtask {
      taskId: string;
      subtasks: ISubtask[];
    }

    export interface CreateFirstStep {
      title: string;
      tags: string[];
    }

    export interface CreateSecondStep {
      title: string;
      description: string;
      subtasks: { title: string; description: string }[];
    }

    export interface SubtaskTable {
      subtasks: { title: string; description: string }[];
    }
  }

  export namespace Common {
    export interface CustomVid extends /* @vue-ignore */ Partial<HTMLVideoElement> {
      stream: MediaStream | null;
      btns?: { fullscreen: boolean };
      mute?: { audio: boolean; video: boolean };
    }

    export interface FormAssistance {
      modelValue: Omit<Responses.Assistance, '_id' | 'sector'>;
      title: string;
      loading: boolean;
      reset: boolean;
    }

    export interface FormAssistanceGroup {
      title: string;
      error?: boolean;
    }

    export interface LoaderPage {
      loading: boolean;
      color?: string;
    }

    export interface LoaderWheel {
      duration?: number;
    }

    export interface SetAvatar {
      modelValue: File | null;
      size?: string;
      src?: string;
      color?: string;
      accept?: string;
    }

    export interface TheError {
      code: number;
      message: string;
    }

    export interface UserAvatar {
      avatar?: string;
      name?: string;
      size?: string;
      color?: string;
    }
  }
}

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

export namespace Extra {
  export namespace Chat {
    export type ModalName = 'modal:group-create' | 'modal:group-info' | 'modal:group-settings' | 'modal:group-add-user';
  }
}
