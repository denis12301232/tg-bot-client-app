import '@/assets/base.scss'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import langRu from 'quasar/lang/ru'
import App from './App.vue'
import router from './router'


const app = createApp(App);

app.use(Quasar, { lang: langRu })
   .use(createPinia())
   .use(router)
   .mount('#app');
