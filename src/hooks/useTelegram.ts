export default function useTelegram() {
   const tg = window.Telegram.WebApp;
   const theme = tg.colorScheme;
   const isOpenedFromTg = !!Object.keys(tg.themeParams).length;

   return { tg, theme, isOpenedFromTg }
}