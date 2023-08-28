import './assets/css/base.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import quasarIconSet from 'quasar/icon-set/eva-icons';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/eva-icons/eva-icons.css';
import 'quasar/src/css/index.sass';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import { datetimeFormats, Pluralization } from './i18n';

const app = createApp(App);
const pinia = createPinia();
const i18n = createI18n<[], 'en' | 'ru' | 'uk', true, {}>({
  legacy: false,
  fallbackLocale: 'ru',
  locale: 'ru',
  messages: {},
  datetimeFormats,
  pluralizationRules: {
    ru: Pluralization.slavic,
    ua: Pluralization.slavic,
  },
});

app.use(pinia).use(router).use(i18n).use(Quasar, { plugins: {}, iconSet: quasarIconSet });
app.mount('#app');
