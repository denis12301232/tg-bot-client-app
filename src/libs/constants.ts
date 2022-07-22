import Validate from "@/libs/Validate"

export const table = {
   fio: 'ФИО',
   phone: 'Телефон',
   birth: 'Дата рождения',
   addr: 'Адрес',
   people_num: 'Число проживающих',
   people_fio: 'ФИО и возраст проживающих',
   invalids: 'Есть ли среди проживающих инвалиды?',
   children: 'Есть ли дети?',
   children_age: 'Возраст детей',
   food: 'Нужны ли продукты питания?',
   water: 'Нужна ли вода?',
   drugs: 'Лекарства?',
   products_detail: 'Укажите кол-во (лекарств)',
   gigien: 'Средства личной гигиены',
   gigien_num: 'Укажите кол-во (средств)',
   pampers: 'Памперсы?',
   diet: 'Особенности диеты и т.п.',
   pers_data_agreement: 'Согласие на обработку перс данных',
   photo_agreement: 'Согласие на фото',
}


export const defaultValues = {
   fio: '',
   phone: '',
   birth: '',
   addr: '',
   people_num: '',
   people_fio: [''],
   invalids: false,
   children: false,
   children_age: [''],
   food: false,
   water: false,
   drugs: false,
   products_detail: '',
   gigien: false,
   gigien_num: 0,
   pampers: '',
   diet: '',
   pers_data_agreement: false,
   photo_agreement: false,
}

export const init = {
   fio: {
      value: '',
      validators: { required: Validate.required },
   },
   phone: {
      value: '',
      validators: { required: Validate.required, isPhone: Validate.isPhone },
   },
   birth: {
      value: '',
      validators: {
         required: Validate.required, isDDMMYYYY: Validate.isDDMMYYYY
      },
   },
   addr: {
      value: '',
      validators: { required: Validate.required },
   },
   people_num: {
      value: '',
      validators: { required: Validate.required },
   },
   people_fio: {
      value: <Array<string>>[],
   },
   invalids: {
      value: false,
   },
   children: {
      value: false,
   },
   children_age: {
      value: <Array<string>>[],
   },
   food: {
      value: false,
   },
   water: {
      value: false,
   },
   drugs: {
      value: false,
   },
   products_detail: {
      value: '',
   },
   gigien: {
      value: false,
   },
   gigien_num: {
      value: '',
   },
   pampers: {
      value: '',
   },
   diet: {
      value: '',
   },
   pers_data_agreement: {
      value: false,
   },
   photo_agreement: {
      value: false,
   }
}
