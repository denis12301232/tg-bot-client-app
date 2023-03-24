import axios from 'axios'
import { Constants } from '@/util'
import { useStore } from '@/stores'


const $api = axios.create({
   withCredentials: true,
   baseURL: Constants.API_V1,
});

$api.interceptors.request.use(config => {
   config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`;
   return config;
});

$api.interceptors.response.use(
   (config) => config,
   async (error) => {
      const store = useStore();
      const originalRequest = error.config;
      
      if (error.response?.status == 401 && error.config && !error.config._isRetry) {
         originalRequest._isRetry = true;
         try {
            await store.refresh();
            return $api.request(originalRequest);
         } catch (e) {
            if (e) console.log(e);
         }
      }
      throw error;
   });

export default $api;