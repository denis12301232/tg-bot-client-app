import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import UI from './components/UI';
import { createPinia } from 'pinia'
import directives from './directives';

const app = createApp(App).use(createPinia());

directives.forEach(item => app.directive(item.name, item));
UI.forEach(item => app.component(item.name, item,));
app.use(router).mount('#app')


