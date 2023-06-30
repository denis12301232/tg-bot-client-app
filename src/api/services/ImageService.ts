import { $api } from '@/api';

export default class ImageService {
  static getImages(params: { skip: number; limit: number; sort: string; descending: boolean }) {
    return $api.get('images/', { searchParams: params });
  }

  static uploadImages(formData: FormData) {
    return $api.post('images/upload', { body: formData, timeout: 6e5 });
  }

  static deleteImages(ids: string[]) {
    return $api.delete('images/delete', { json: ids, timeout: 6e5 });
  }

  static updateDescription(id: string, description: string) {
    return $api.patch('images/description', { json: { id, description } });
  }
}
