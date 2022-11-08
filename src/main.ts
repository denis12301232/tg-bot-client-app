import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'
import UI from './components/UI'
import { createPinia } from 'pinia'
import directives from './directives'

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = markRaw(router);
});


directives.forEach(item => app.directive(item.name, item));
UI.forEach(item => app.component(item.name, item));
app.use(router).use(pinia).mount('#app');