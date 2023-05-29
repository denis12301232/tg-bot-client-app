import { $api } from '@/api';

export default class ImageService {
  static getImages(pageToken?: string) {
    return $api.get('images/', { searchParams: pageToken ? { pageToken } : undefined });
  }

  static uploadImages(formData: FormData) {
    return $api.post('images/upload', { body: formData });
  }

  static deleteImages(ids: string[]) {
    return $api.delete('images/delete', { json: ids });
  }
}
