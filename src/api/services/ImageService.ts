import type { QUploaderFactoryObject } from 'quasar';
import { $api } from '@/api';
import { ENV } from '@/util';

export default class ImageService {
  static getImages(params: { skip: number; limit: number; sort: string; descending: boolean }) {
    return $api.get('images/', { searchParams: params });
  }

  static uploadImages(): QUploaderFactoryObject {
    return {
      url: ENV.API_V1 + '/images/upload',
      method: 'POST',
      headers: [{ name: 'Authorization', value: `Bearer ${localStorage.getItem('token')}` }],
      withCredentials: true,
    };
  }

  static deleteImages(ids: string[]) {
    return $api.delete('images/delete', { json: ids, timeout: 6e5 });
  }

  static updateDescription(id: string, description: string) {
    return $api.patch('images/description', { json: { id, description } });
  }
}
