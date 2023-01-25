export default class Constants {
   static readonly API_V1 = import.meta.env.VITE_API_V1;
   static readonly SERVER_URL = import.meta.env.VITE_SERVER_URL;
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

}