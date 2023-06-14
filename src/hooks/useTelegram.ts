import type { Langs } from '@/types';

export default function useTelegram() {
  const tg = window.Telegram.WebApp;
  const theme = tg.colorScheme;
  const isOpenedFromTg = !!Object.keys(tg.themeParams).length;
  const locale = (tg.initDataUnsafe.user?.language_code as Langs) || 'ru';

  return { tg, theme, isOpenedFromTg, locale };
}
