import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'
import UI from './components/UI'
import directives from './directives'
import * as components from 'vuetify/components'
import * as vuetifyDirectives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'core-js'

const app = createApp(App);
const pinia = createPinia();
const vuetify = createVuetify({ components, directives: vuetifyDirectives });

pinia.use(({ store }) => { store.$router = markRaw(router) });
directives.forEach(item => app.directive(item.name, item));
UI.forEach(item => app.component(item.name, item));
app.use(pinia).use(router).use(vuetify).mount('#app');