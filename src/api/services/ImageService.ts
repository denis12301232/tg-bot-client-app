import { $api } from '@/api';

export default class ImageService {
  static getImages(params: { skip: number; limit: number; sort: string; descending: boolean }) {
    return $api.get('images/', { searchParams: params });
  }

  static uploadImages(formData: FormData) {
    return $api.post('images/upload', { body: formData });
  }

  static deleteImages(ids: string[]) {
    return $api.delete('images/delete', { json: ids });
  }

  static updateDescription(id: string, description: string) {
    return $api.patch('images/description', { json: { id, description } });
  }
}
