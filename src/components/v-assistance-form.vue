<template lang="pug">
.form_container
   form.form(type="submit", @submit.prevent="submit")
      .title-list {{ title }}
      .select(:class="{ error: !form.fio.valid && form.fio.touched }")
         .select_title ФИО
         input(type="text", placeholder="ФИО", v-model="form.fio.value", @blur="form.fio.blur")
         small.error_message(v-if="form.fio.errors.required && form.fio.touched")
            span.note ! 
            | Это обязательное поле
      .select(:class="{ error: !form.phone.valid && form.phone.touched }")
         .select_title Введите телефон
         input(type="tel", placeholder="Телефон", maxlength="13", @input="formatPhone" :value="form.phone.value", @blur="form.phone.blur")
         small.error_message(v-if="form.phone.errors.required && form.phone.touched")
            span.note ! 
            | Это обязательное поле
         small.error_message(v-else-if="form.phone.errors.isPhone && form.phone.touched")
            span.note ! 
            | Неверный номер
      .select(:class="{ error: !form.birth.valid && form.birth.touched }")
         .select_title Введите дату рождения (дд.мм.гггг)
         input(type="date", placeholder="дд.мм.гггг", v-model="form.birth.value", @blur="form.birth.blur", required)
         small.error_message(v-if="form.birth.errors.required && form.birth.touched")
            span.note ! 
            | Это обязательное поле
         small.error_message(v-else-if="form.birth.errors.isDDMMYYYY && form.birth.touched")
            span.note !  
            | Неверный формат даты
      .select(:class="{ error: !form.addr.valid && form.addr.touched }")
         .select_title Введите адрес
         input(type="text", placeholder="Адрес", v-model="form.addr.value", @blur="form.addr.blur")
         small.error_message(v-if="form.addr.errors.required && form.addr.touched")
            span.note ! 
            | Это обязательное поле
      .select(:class="{ error: !form.people_num.valid && form.people_num.touched }")
         .select_title Введите число проживающих
         input(type="number", placeholder="Число проживающих", v-model="form.people_num.value", @blur="form.people_num.blur")
         small.error_message(v-if="form.people_num.errors.required && form.people_num.touched")
            span.note ! 
            | Это обязательное поле
      .select(v-if="+form.people_num.value > 1")
         .select_title Введите ФИО и возраст проживающих
         input(
            v-for="item in +form.people_num.value - 1",
            type="text", 
            placeholder="ФИО и возраст", 
            v-model="form.people_fio.value[+item - 1]",
            )
      .select
         .select_title Есть ли среди проживающих инвалиды?
         .select_point
            input.set(type="radio", :value="true", v-model="form.invalids.value")
            .set_name Да
         .select_point
            input.set(type="radio", :value="false", v-model="form.invalids.value")
            .set_name Нет    
      .select
         .select_title Есть ли дети?
         .select_point
            input.set(type="radio", :value="true", v-model="form.children.value")
            .set_name Да
         .select_point
            input.set(type="radio", :value="false", v-model="form.children.value")
            .set_name Нет
      .select(v-if="form.children.value")
         .select_title Отметьте возраст детей
         .select_point
            input.set(type="checkbox", value="0-1", v-model="form.children_age.value")
            .set_name 0-1
         .select_point
            input.set(type="checkbox", value="1-3", v-model="form.children_age.value")
            .set_name 1-3
         .select_point
            input.set(type="checkbox", value="3-9", v-model="form.children_age.value")
            .set_name 3-9
         .select_point 
            input.set(type="checkbox", value="9-18", v-model="form.children_age.value")
            .set_name 9-18
      .select 
         .select_title Нужны ли продукты питания?
         .select_point 
            input.set(type="radio", :value="true", v-model="form.food.value")
            .set_name Да
         .select_point 
            input.set(type="radio", :value="false", v-model="form.food.value")
            .set_name Нет
      .select 
         .select_title Нужна ли вода?
         .select_point 
            input.set(type="radio", :value="true", v-model="form.water.value")
            .set_name Да
         .select_point 
            input.set(type="radio", :value="false", v-model="form.water.value")
            .set_name Нет
      .select 
         .select_title Нужны ли лекарства?
         .select_point 
            input.set(type="radio", :value="true", v-model="form.drugs.value")
            .set_name Да
         .select_point 
            input.set(type="radio", :value="false", v-model="form.drugs.value")
            .set_name Нет
      .select(v-if="form.drugs.value")
         .select_title Раскажите, какие именно, кол-во, дозу
         input(type="text", v-model="form.products_detail.value", placeholder="Мой ответ")
      .select
         .select_title Нужны ли средства личной гигиены?
         .select_point
            input.set(type="radio", :value="true", v-model="form.gigien.value")
            .set_name Да
         .select_point
            input.set(type="radio", :value="false", v-model="form.gigien.value")
            .set_name Нет
      .select(v-if="form.gigien.value")
         .select_title Укажите кол-во
         input(type="number", v-model="form.gigien_num.value", placeholder="Мой ответ")
      .select 
         .select_title Памперсы?
         input(type="text", v-model="form.pampers.value", placeholder="Мой ответ")
      .select 
         .select_title Особенности диеты, алергии, диабет и т.д.
         input(type="text", v-model="form.diet.value", placeholder="Мой ответ")
      .select
         .select_title Даю согласие на обработку персональных данных
         .select_point
            input.set(type="checkbox", :value="true", v-model="form.pers_data_agreement.value")
            .set_name Согласен/согласна
      .select
         .select_title Даю согласие на фото/видео
         .select_point
            input.set(type="checkbox", :value="true", v-model="form.photo_agreement.value")
            .set_name Согласен/согласна
      .confirm
         .confirm_block
            v-button.confirm_button(type="submit", :disabled="!form.valid || !form.pers_data_agreement.value || !form.photo_agreement.value") Отправить
            v-loading-wheel(v-if="isLoading")
            .api_error {{ error }}
            .success {{ success }}
         .confirm_block
            slot.confirm_button
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

      const formatPhone = (event: Event): string => {
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

      return { form, error, success, isLoading, submit, formatPhone }
   }
})
</script>

<style lang="scss" scoped>
.form_container {
   display: flex;
   justify-content: center;

   & .form {
      width: 100%;

      & .title-list {
         text-align: center;
         font-size: 1.5em;
      }

      & .select {
         border: 1px solid #dadce0;
         display: block;
         margin-top: 10px;
         background-color: white;
         border-radius: 5px;
         padding: 15px;

         & .select_title {
            margin-bottom: 20px;
         }

         & .select_point {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            & .set {
               margin: 0;
               padding: 0;
            }

            & .set_name {
               margin-left: 5px;
            }
         }

         & .error_message {
            display: block;
            margin-top: 20px;
            color: red;

            & .note {
               font-size: 1.3em;
               font-weight: bold;
            }
         }
      }

      & .confirm {
         display: flex;
         justify-content: space-between;
         align-items: baseline;

         & .confirm_block {
            display: flex;
            padding-bottom: 5px;
            justify-items: baseline;
            margin-top: 5px;

            & .confirm_button {
               height: 30px;
            }

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
      }
   }

   & .error {
      border: 1px solid red;
   }
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

input[type="text"],
input[type="number"],
input[type="date"],
input[type="tel"]::-webkit-outer-spin-button,
::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}


input[type="date"]:not(:invalid) {
   &::-webkit-datetime-edit-month-field,
   &::-webkit-datetime-edit-day-field,
   &::-webkit-datetime-edit-year-field {
      color: black !important;
   }
}

input[type="date"]::-webkit-datetime-edit-month-field,
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

@media(max-width: 768px) {
   .form_container {
      width: 95%;
      margin: 0 auto;
   }
}
</style>