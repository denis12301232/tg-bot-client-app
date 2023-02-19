export default class Constants {
   static readonly API_V1 = import.meta.env.VITE_API_V1;
   static readonly SERVER_URL = import.meta.env.VITE_SERVER_URL;
   static readonly SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
   static readonly districts = [
      'Индустриальный', 'Киевский', 'Московский', 'Немышлянский', 'Новобаварский',
      'Основянский', 'Слободской', 'Холодногорский', 'Шевченковский'
   ];
   static readonly locale = {
      days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
      daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      months: [
         'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
         'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ],
      monthsShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
      firstDayOfWeek: 0,
      format24h: true,
      pluralDay: 'дни'
   };
   static readonly yesNoOptions = [
      { label: 'Да', value: 'Да' },
      { label: 'Нет', value: 'Нет' }
   ];
   static readonly assistance = {
      surname: 'Фамилия',
      name: 'Имя',
      patronymic: 'Отчество',
      phone: 'Телефон',
      birth: 'Дата рождения',
      district: 'Район',
      street: 'Улица/Проспект/Переулок',
      house: 'Дом',
      flat: 'Квартира',
      people_num: 'Число проживающих',
      people_fio: 'ФИО и возраст проживающих',
      invalids: 'Есть ли среди проживающих инвалиды?',
      kids: 'Есть ли дети?',
      kids_age: 'Возраст детей',
      food: 'Нужны ли продукты питания?',
      water: 'Нужна ли вода?',
      medicines: 'Лекарства?',
      medicines_info: 'Укажите какие?',
      hygiene: 'Средства личной гигиены',
      hygiene_info: 'Укажите какие?',
      pampers: 'Памперсы?',
      pampers_info: 'Укажите какие?',
      diet: 'Особенности диеты и т.п.',
      pers_data_agreement: 'Согласие на обработку персональных данных',
      photo_agreement: 'Согласие на фото',
   };

}