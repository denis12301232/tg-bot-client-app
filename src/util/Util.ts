import type { ITask, Responses } from '@/types';
import type { ComposerTranslation } from 'vue-i18n';

export default class Util {
  static debounceDecorator(f: Function, ms: number) {
    let isCooldown = false;

    return function (this: any, ...args: any) {
      if (isCooldown) return;
      f.apply(this, args);
      isCooldown = true;
      setTimeout(() => (isCooldown = false), ms);
    };
  }

  static throttleDecorator(f: Function, ms: number) {
    let isThrottled = false;
    let savedArgs: any = null;
    let savedThis: any = null;

    async function wrapper(this: any, ...args: any) {
      if (isThrottled) {
        savedArgs = args;
        savedThis = this;
        return;
      }

      isThrottled = true;
      await f.apply(this, args);

      setTimeout(function () {
        isThrottled = false;
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }
    return wrapper;
  }

  static async copyTextToClipboard(text: string) {
    if (navigator.clipboard) {
      return navigator.clipboard
        .writeText(text)
        .then(() => 'Скопировано')
        .catch(() => 'Ошибка');
    } else {
      const textArea = document.createElement('textarea');
      textArea.style.cssText = `position: fixed;top: -9999px;left: -9999px;`;
      textArea.value = text;
      document.documentElement.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.documentElement.removeChild(textArea);
      return success ? Promise.resolve('Скопировано') : Promise.reject('Ошибка');
    }
  }

  static setStatusColor(status: ITask['status']) {
    switch (status) {
      case 'untaken':
        return 'warning';
      case 'performed':
        return 'primary';
      case 'canceled':
        return 'negative';
      case 'completed':
        return 'positive';
      default:
        return 'positive';
    }
  }

  static formatAssistanceValue(value: any, key: any, t: ComposerTranslation, district?: number | null) {
    if (key === 'district') {
      return t(`extra.districts.${value}`);
    } else if (key === 'street') {
      return t(`extra.streets[${district}][${value}]`);
    } else if (Array.isArray(value)) {
      return value.length ? value.join(',') : '-';
    } else if (value === true) {
      return t('home.form.checkboxes.yesNo[0]');
    } else if (value === false) {
      return t('home.form.checkboxes.yesNo[1]');
    } else if (!value) {
      return '-';
    } else {
      return value;
    }
  }

  static formatForm(form: Responses.Assistance) {
    const { _id, ...rest } = form;
    return rest;
  }
}
