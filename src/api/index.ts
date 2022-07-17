import axios from "axios";

const $api = axios.create({
   //withCredentials: true,
   baseURL: process.env.VUE_APP_API_URL,
});

export default $api;