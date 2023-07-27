import type { I18n, Langs } from '@/types';
import { useI18n } from 'vue-i18n';

export default function useI18nT() {
  const { t, messages, locale } = useI18n<I18n, Langs>();

  return { t, messages, locale };
}
