import type { ITask, Responses } from '@/types';
import type { ComposerTranslation } from 'vue-i18n';

export default class Util {
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
