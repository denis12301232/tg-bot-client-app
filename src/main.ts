import './assets/base.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import quasarLang from 'quasar/lang/ru';
import quasarIconSet from 'quasar/icon-set/eva-icons';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/eva-icons/eva-icons.css';
import 'quasar/src/css/index.sass';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import { locale } from './i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

const app = createApp(App);
const pinia = createPinia();
export const i18n = createI18n({ legacy: false, fallbackLocale: 'ru', locale, messages,  });

app.use(pinia).use(router).use(i18n).use(Quasar, { plugins: {}, lang: quasarLang, iconSet: quasarIconSet });
app.mount('#app');
