import type { ImagesResponse, UploadImagesResponse } from '@/types'
import axios from 'axios'
import $api from '@/api'
import { ENV } from '@/util'


export default class ImageService {
   static getImages(pageToken?: string) {
      return axios.get<ImagesResponse>(`${ENV.API_V1}/images/`, {
         params: { pageToken }
      });
   }

   static uploadImages(formData: FormData) {
      return $api.post<UploadImagesResponse>(`${ENV.API_V1}/images/upload`, formData);
   }

   static deleteImages(ids: string[]) {
      return $api.delete<string[]>(`${ENV.API_V1}/images/delete`, { data: ids });
   }
}