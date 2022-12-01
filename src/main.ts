import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'
import UI from './components/UI'
import { createPinia } from 'pinia'
import directives from './directives'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as vuetifyDirectives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = markRaw(router);
});

const vuetify = createVuetify({
  components,
  directives: vuetifyDirectives,
});

directives.forEach(item => app.directive(item.name, item));
UI.forEach(item => app.component(item.name, item));
app.use(pinia).use(router).use(vuetify).mount('#app');