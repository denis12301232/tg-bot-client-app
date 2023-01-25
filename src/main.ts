import './assets/main.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import App from './App.vue'
import router from './router'



const app = createApp(App);

app.use(Quasar)
   .use(createPinia())
   .use(router)
   .mount('#app')

