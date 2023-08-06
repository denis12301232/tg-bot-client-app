import type { ComposerTranslation } from 'vue-i18n';
import Validate from './Validate';

export default class Rules {
  static assistance(t: ComposerTranslation) {
    return {
      surname: [(v: string) => Validate.required(v) || t('home.form.fields.surname.errors.required')],
      name: [(v: string) => Validate.required(v) || t('home.form.fields.name.errors.required')],
      patronymic: [(v: string) => Validate.required(v) || t('home.form.fields.patronymic.errors.required')],
      phone: [
        (v: string) => Validate.required(v) || t('home.form.fields.phone.errors.required'),
        (v: string) => Validate.isPhone(v.replace(/\s|-|\(|\)/g, '')) || t('home.form.fields.phone.errors.isPhone'),
      ],
      birth: [
        (v: string) => Validate.required(v) || t('home.form.fields.birth.errors.required'),
        (v: string) => Validate.isYYYYMMDD(v) || t('home.form.fields.birth.errors.isYYYYMMDDD'),
      ],
      district: [(v: string) => Validate.required(v) || t('home.form.fields.district.errors.required')],
      street: [(v: string) => Validate.required(v) || t('home.form.fields.street.errors.required')],
      house: [(v: string) => Validate.required(v) || t('home.form.fields.house.errors.required')],
      flat: [
        (v: string) => Validate.required(v) || t('home.form.fields.flat.errors.required'),
        (v: string) => Validate.isNumber(v) || t('home.form.fields.flat.errors.isNumber'),
      ],
      peopleCount: [
        (v: string) => Validate.required(v) || t('home.form.fields.peopleCount.errors.required'),
        (v: string) => Validate.isNumber(v) || t('home.form.fields.peopleCount.errors.isNumber'),
        (v: string) => Validate.minMax(1, 10)(v) || t('home.form.fields.peopleCount.errors.minMax'),
      ],
    };
  }

  static login(t: ComposerTranslation) {
    return {
      loginOrEmail: [(v: string) => Validate.required(v) || t('login.form.fields.loginOrEmail.errors.required')],
      password: [(v: string) => Validate.required(v) || t('login.form.fields.password.errors.required')],
    };
  }

  static registration(t: ComposerTranslation) {
    return {
      name: [
        (v: string) => Validate.required(v) || t('registration.form.fields.name.errors.required'),
        (v: string) => Validate.noManySpaces(v) || t('registration.form.fields.name.errors.noManySpaces'),
      ],
      login: [
        (v: string) => Validate.required(v) || t('registration.form.fields.login.errors.required'),
        (v: string) =>
          Validate.isLatinOrUnderscore(v) || t('registration.form.fields.login.errors.isLatinOrUnderscore'),
      ],
      email: [
        (v: string) => Validate.required(v) || t('registration.form.fields.email.errors.required'),
        (v: string) => Validate.isEmail(v) || t('registration.form.fields.email.errors.isEmail'),
      ],
      password: [
        (v: string) => Validate.required(v) || t('registration.form.fields.password.errors.required'),
        (v: string) =>
          Validate.lengthInterval(6, 20)(v) || t('registration.form.fields.password.errors.lengthInterval'),
      ],
    };
  }
}
