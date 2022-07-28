import axios from "axios";
import { API_URL } from "@/libs/constants";
import AuthController from "./controllers/AuthController";

const $api = axios.create({
   withCredentials: true,
   baseURL: API_URL,
});

$api.interceptors.request.use(config => {
   config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`;
   return config;
});

$api.interceptors.response.use(
   (config) => {
      return config;
   },
   async (error) => {

      const originalRequest = error.config;

      if (error.response.status == 401 && error.config && !error.config._isRetry) {
         originalRequest._isRetry = true;
         try {
            await AuthController.refresh();
            return $api.request(originalRequest);
         } catch (e) {
            if (e) console.log(e);
         }

      }
      throw error;
   });

export default $api;

// const $auth = axios.create({
//    withCredentials: true,
//    baseURL: API_URL,
// });