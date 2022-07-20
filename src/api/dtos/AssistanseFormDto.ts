export default class HumansFormListDto {

   [name: string]: any,

   constructor(form: any) {

      const allFields = ['fio', 'phone', 'birth', 'addr',
         'people_num', 'people_fio', 'invalids', 'children',
         'children_age', 'food', 'drugs', 'water', 'products_detail',
         'gigien', 'gigien_num', 'pampers', 'diet', 'pers_data_agreement', 'photo_agreement'
      ];
      for (const item of allFields) {

         if (item === 'children_age' || item === 'people_fio') {
            if (!form[item].value.length) continue;
            this[item] = [];
            form[item].value.map((elem: any) => this[item].push(elem));
            continue;
         }

         //if (!form[item].value) continue;
         this[item] = form[item].value;
      }
   }
}