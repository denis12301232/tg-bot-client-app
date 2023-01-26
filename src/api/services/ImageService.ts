import type { ImagesResponse } from '@/types/http'
import axios from 'axios'
import { Constants } from '@/util'

export default class ImageService {
   static getImages(pageToken?: string) {
      return axios.get<ImagesResponse>(`${Constants.API_V1}/images/`, {
         params: { pageToken }
      });
   }
}