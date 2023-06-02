import type { languages } from '@/i18n';

export type Text = (typeof languages)[keyof typeof languages];
export type Langs = 'ru' | 'ua' | 'en';
export type I18n = { message: Text };
