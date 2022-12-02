import Validate from '@/libs/Validate'

export default class Constants {
   static readonly API_URL = process.env.VUE_APP_API_URL;
   static readonly districts = [
      'Индустриальный', 'Киевский', 'Московский', 'Немышлянский', 'Новобаварский',
      'Основянский', 'Слободской', 'Холодногорский', 'Шевченковский'
   ];
   static readonly weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
   static readonly monthes = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
   ];

   static readonly assistance = {
      surname: {
         display: 'Фамилия',
         default: '',
         value: '',
         validators: { required: Validate.required },
      },
      name: {
         display: 'Имя',
         default: '',
         value: '',
         validators: { required: Validate.required },
      },
      patronymic: {
         display: 'Отчество',
         default: '',
         value: '',
         validators: { required: Validate.required },
      },
      phone: {
         display: 'Телефон',
         default: '',
         value: '',
         validators: { required: Validate.required, isPhone: Validate.isPhone },
      },
      birth: {
         display: 'Дата рождения',
         default: '',
         value: '',
         validators: { required: Validate.required, isDDMMYYYY: Validate.isYYYYMMDD },
      },
      district: {
         display: 'Район',
         default: '',
         value: null,
         validators: { required: Validate.required },
      },
      street: {
         display: 'Улица',
         default: '',
         value: '',
         validators: { required: Validate.required },
      },
      house: {
         display: 'Дом',
         default: '',
         value: '',
         validators: { required: Validate.required },
      },
      flat: {
         display: 'Квартира',
         default: '',
         value: '',
         validators: { required: Validate.required },
      },
      people_num: {
         display: 'Число проживающих',
         default: '',
         value: '',
         validators: { required: Validate.required },
      },
      people_fio: {
         display: 'ФИО и возраст проживающих',
         default: [''],
         value: <Array<string>>[],
      },
      invalids: {
         display: 'Есть ли среди проживающих инвалиды?',
         default: 'Нет',
         value: 'Нет',
      },
      children: {
         display: 'Есть ли дети?',
         default: 'Нет',
         value: 'Нет',
      },
      children_age: {
         display: 'Возраст детей',
         default: [],
         value: <Array<string>>[],
      },
      food: {
         display: 'Нужны ли продукты питания?',
         default: 'Нет',
         value: 'Нет',
      },
      water: {
         display: 'Нужна ли вода?',
         default: 'Нет',
         value: 'Нет',
      },
      drugs: {
         display: 'Лекарства?',
         default: 'Нет',
         value: 'Нет',
      },
      products_detail: {
         display: 'Укажите кол-во (лекарств)',
         default: '',
         value: '',
      },
      gigien: {
         display: 'Средства личной гигиены',
         default: 'Нет',
         value: 'Нет',
      },
      gigien_num: {
         display: 'Укажите кол-во (средств)',
         default: '',
         value: '',
      },
      pampers: {
         display: 'Памперсы?',
         default: '',
         value: '',
      },
      diet: {
         display: 'Особенности диеты и т.п.',
         default: '',
         value: '',
      },
      pers_data_agreement: {
         display: 'Согласие на обработку перс данных',
         default: false,
         value: false,
         validators: { required: Validate.required },
      },
      photo_agreement: {
         display: 'Согласие на фото',
         default: false,
         value: false,
         validators: { required: Validate.required },
      },
   };

   static readonly LogFormInit = {
      email: {
         value: "",
         validators: {
            required: Validate.required,
            isEmail: Validate.isEmail,
         },
      },
      password: {
         value: "",
         validators: {
            required: Validate.required,
            minLength: Validate.minLength(6),
         },
      },
   };

   static readonly RegFormInit = {
      ...this.LogFormInit,
      name: {
         value: "",
         validators: {
            required: Validate.required,
         }
      },
   }
}