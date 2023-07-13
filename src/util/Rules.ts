import type { I18n, Langs } from '@/types';
import type { ComposerTranslation } from 'vue-i18n';
import Validate from './Validate';

export default class Rules {
  static assistance(t: ComposerTranslation<I18n, Langs>) {
    return {
      surname: [(v: string) => Validate.required(v) || t('home.form.errors.surname.required')],
      name: [(v: string) => Validate.required(v) || t('home.form.errors.name.required')],
      patronymic: [(v: string) => Validate.required(v) || t('home.form.errors.patronymic.required')],
      phone: [
        (v: string) => Validate.required(v) || t('home.form.errors.phone.required'),
        (v: string) => Validate.isPhone(v.replace(/\s|-|\(|\)/g, '')) || t('home.form.errors.phone.isPhone'),
      ],
      birth: [
        (v: string) => Validate.required(v) || t('home.form.errors.birth.required'),
        (v: string) => Validate.isYYYYMMDD(v) || t('home.form.errors.birth.isYYYYMMDD'),
      ],
      district: [(v: string) => Validate.required(v) || t('home.form.errors.district.required')],
      street: [(v: string) => Validate.required(v) || t('home.form.errors.street.required')],
      house: [(v: string) => Validate.required(v) || t('home.form.errors.house.required')],
      flat: [
        (v: string) => Validate.required(v) || t('home.form.errors.flat.required'),
        (v: string) => Validate.isNumber(v) || t('home.form.errors.flat.isNumber'),
      ],
      people_num: [
        (v: string) => Validate.required(v) || t('home.form.errors.peopleNum.required'),
        (v: string) => Validate.isNumber(v) || t('home.form.errors.peopleNum.isNumber'),
        (v: string) => Validate.minMax(1, 10)(v) || t('home.form.errors.peopleNum.minMax'),
      ],
    };
  }
}
