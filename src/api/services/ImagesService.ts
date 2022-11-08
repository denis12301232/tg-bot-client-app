import axios, { AxiosResponse } from 'axios'
import Constants from '@/libs/Constants'
import { ImagesResponse } from '@/intefaces/http'

export default class ImagesService {
   static getImages(pageToken?: string): Promise<AxiosResponse<ImagesResponse>> {
      return axios.get<ImagesResponse>(`${Constants.API_URL}/images/`, {
         params: { pageToken }
      });
   }
}