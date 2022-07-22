<template lang="pug">
.form_container
   form(type="submit", @submit.prevent="submit").form
      div.title-list {{ title }}
      .points
         label.points_point(:class="{ error: !form.fio.valid && form.fio.touched }")
            .label_title ФИО
            input(type="text", placeholder="ФИО", v-model="form.fio.value", @blur="form.fio.blur")
            small(v-if="form.fio.errors.required && form.fio.touched")
               span.note ! 
               | Это обязательное поле
         label.points_point(:class="{ error: !form.phone.valid && form.phone.touched }")
            .label_title Введите телефон
            input(type="tel", placeholder="Телефон", maxlength="13", @input="usePhone" :value="form.phone.value", @blur="form.phone.blur")
            small(v-if="form.phone.errors.required && form.phone.touched")
               span.note ! 
               | Это обязательное поле
            small(v-else-if="form.phone.errors.isPhone && form.phone.touched")
               span.note ! 
               | Неверный номер
         label.points_point(:class="{ error: !form.birth.valid && form.birth.touched }")
            .label_title Введите дату рождения (дд.мм.гггг)
            input(type="date", placeholder="дд.мм.гггг", v-model="form.birth.value", @blur="form.birth.blur")
            small(v-if="form.birth.errors.required && form.birth.touched")
               span.note ! 
               | Это обязательное поле
            small(v-else-if="form.birth.errors.isDDMMYYYY && form.birth.touched")
               span.note !  
               | Неверный формат даты
         label.points_point(:class="{ error: !form.addr.valid && form.addr.touched }")
            .label_title Введите адрес
            input(type="text", placeholder="Адрес", v-model="form.addr.value", @blur="form.addr.blur")
            small(v-if="form.addr.errors.required && form.addr.touched")
               span.note ! 
               | Это обязательное поле
         label.points_point(:class="{ error: !form.people_num.valid && form.people_num.touched }")
            .label_title Введите число проживающих
            input(type="number", placeholder="Число проживающих", v-model="form.people_num.value", @blur="form.people_num.blur")
            small(v-if="form.people_num.errors.required && form.people_num.touched")
               span.note ! 
               | Это обязательное поле
         label.points_point(v-if="+form.people_num.value > 1")
            .label_title Введите ФИО и возраст проживающих
            input(
               v-for="item in +form.people_num.value - 1",
               type="text", 
               placeholder="ФИО и возраст", 
               v-model="form.people_fio.value[+item - 1]",
               )
         div.points_point
            .label_title Есть ли среди проживающих инвалиды?
               .choose
                  div
                     input(type="radio", :value="true", v-model="form.invalids.value")
                     | Да
                  div
                     input(type="radio", :value="false", v-model="form.invalids.value")
                     | Нет    
         div.points_point
            .label_title Есть ли дети?
               .choose
                  div
                     input(type="radio", :value="true", v-model="form.children.value")
                     | Да
                  div
                     input(type="radio", :value="false", v-model="form.children.value")
                     | Нет
         div.points_point(v-if="form.children.value")
            .label_title Отметьте возраст детей
               .choose
                  div 
                     input(type="checkbox", value="0-1", v-model="form.children_age.value")
                     | 0-1
                  div
                     input(type="checkbox", value="1-3", v-model="form.children_age.value")
                     | 1-3
                  div
                     input(type="checkbox", value="3-9", v-model="form.children_age.value")
                     | 3-9
                  div 
                     input(type="checkbox", value="9-18", v-model="form.children_age.value")
                     | 9-18
         div.points_point 
            .label_title Нужны ли продукты питания?
               .choose
                  div
                     input(type="radio", :value="true", v-model="form.food.value")
                     | Да
                  div
                     input(type="radio", :value="false", v-model="form.food.value")
                     | Нет
         div.points_point 
            .label_title Нужна ли вода?
               .choose
                  div
                     input(type="radio", :value="true", v-model="form.water.value")
                     | Да
                  div
                     input(type="radio", :value="false", v-model="form.water.value")
                     | Нет
         div.points_point 
            .label_title Нужны ли лекарства?
               .choose
                  div
                     input(type="radio", :value="true", v-model="form.drugs.value")
                     | Да
                  div
                     input(type="radio", :value="false", v-model="form.drugs.value")
                     | Нет
         label.points_point(v-if="form.drugs.value")
            .label_title Раскажите, какие именно, кол-во, дозу
            input(type="text", v-model="form.products_detail.value", placeholder="Мой ответ")
         div.points_point
            .label_title Нужны ли средства личной гигиены?
               .choose
                  div
                     input(type="radio", :value="true", v-model="form.gigien.value")
                     | Да
                  div
                     input(type="radio", :value="false", v-model="form.gigien.value")
                     | Нет
         label.points_point(v-if="form.gigien.value")
            .label_title Укажите кол-во
            input(type="number", v-model="form.gigien_num.value", placeholder="Мой ответ")
         div.points_point 
            .label_title Памперсы?
            input(type="text", v-model="form.pampers.value", placeholder="Мой ответ")
         .label_title.points_point Особенности диеты, алергии, диабет и т.д.
            input(type="text", v-model="form.diet.value", placeholder="Мой ответ")
         div.points_point
            .label_title Даю согласие на обработку персональных данных
            input(type="checkbox", :value="true", v-model="form.pers_data_agreement.value")
            | Согласен/согласна
         div.points_point
            .label_title Даю согласие на фото/видео
            input(type="checkbox", :value="true", v-model="form.photo_agreement.value")
            | Согласен/согласна
         div.bottom_block
            div.bottom_block_buttons
               v-button.test(type="submit", :disabled="!form.valid || !form.pers_data_agreement.value || !form.photo_agreement.value") Отправить
               v-loading-wheel(v-if="isLoading")
               .api_error {{ error }}
               .success {{ success }}
            div.bottom_block_buttons
               slot.test
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AssistanceFormValidators } from "@/intefaces/AssistanceFormValidators"
import { computed } from "@vue/reactivity";

export default defineComponent({
   props: {
      form: {
         type: Object as () => AssistanceFormValidators,
         required: true,
      },
      error: {
         type: String,
         default: '',
      },
      success: {
         type: String,
         default: '',
      },
      isLoading: {
         type: Boolean,
         default: false,
      },
      submit: {
         type: Function as (...args: any) => any,
         required: true,
      },
      title: {
         type: String,
         default: 'Заявка на получение гуманитарной помощи',
      }
   },
   setup(props) {
      const form = computed(() => props.form);
      const error = computed(() => props.error);
      const success = computed(() => props.success);
      const isLoading = computed(() => props.isLoading);
      const submit = computed(() => props.submit);

      const usePhone = (event: Event): string => {
         const target = <HTMLInputElement>event.target;
         props.form.phone.value = target.value;

         const numbers = props.form.phone.value.replace(/\D/g, "");

         if (!numbers) {
            target.value = "";
            return props.form.phone.value = "";
         }

         if (numbers.startsWith('0')) {
            return props.form.phone.value = '+38' + numbers;
         } else {
            return props.form.phone.value = '+' + numbers;
         }
      }

      return { form, error, success, isLoading, submit, usePhone }
   }
})
</script>

<style lang="scss" scoped>
.form_container {
   display: flex;
   justify-content: center;

   & .label_title {
      font-weight: 530;
   }

   & .form {
      width: 100%;
   }

   & .points_point {
      border: 1px solid #dadce0;
      display: block;
      margin-top: 10px;
      background-color: white;
      border-radius: 5px;
      padding: 15px;
   }

   & .choose {
      display: flex;
      flex-direction: column;
   }

   & small {
      display: block;
      margin-top: 20px;
      color: red;
   }

   & .note {
      font-size: 1.3em;
      font-weight: bold;
   }

   & .error {
      border: 1px solid red;
   }
}

.bottom_block {
   display: flex;
   justify-content: space-between;
   align-items: baseline;
}

.bottom_block_buttons {
   display: flex;
   padding-bottom: 5px;
   justify-items: baseline;
   margin-top: 5px;

   & .api_error {
      color: red;
      height: 30px;
      line-height: 30px;
      font-weight: bolder;
      margin-right: 5px;
   }

   & .success {
      color: rgb(10, 157, 10);
      font-weight: bolder;
      height: 30px;
      line-height: 30px;
      margin-right: 5px;
   }
}

.test {
   height: 30px;
}

input {
   margin-top: 20px;

}

input[type="text"],
input[type="number"],
input[type="date"],
input[type="tel"] {
   width: 100%;
   border-top: 0;
   border-left: 0;
   border-right: 0;
   border-bottom: 1px solid black;
   display: block;
   -moz-appearance: textfield;
   -webkit-appearance: none;
   background-color: white;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}

::-webkit-datetime-edit-month-field,
::-webkit-datetime-edit-day-field,
::-webkit-datetime-edit-year-field {
   color: #757575;
}

input:active,
:hover,
:focus {
   outline: 0;
   outline-offset: 0;
}

.title-list {
   text-align: center;
   font-size: 1.5em;
}

@media(max-width: 768px) {
   .form_container {
      width: 95%;
      margin: 0 auto;
   }
}
</style>