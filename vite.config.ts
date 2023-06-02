import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vueJsx(),
    quasar({ sassVariables: 'src/quasar-variables.sass', autoImportComponentCase: 'combined' }),
    VueI18nPlugin({
      include: fileURLToPath(new URL('./src/i18n/**/*.json', import.meta.url)),
      runtimeOnly: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
});
