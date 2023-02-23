<template lang="pug">
div(class="container")
   h4(class="title") Полный
   form(class="form" @submit.prevent="onFetchForms")
      QInput(
         v-model="search" 
         class="form_input" 
         outlined 
         label="Имя или фамилия"
         :error="!!error"
         :error-message="error"
         )
      QBtn(color="primary" type="submit" :loading="loading" :disable="!search") Найти
   div(style="display: flex; justify-content: center; margin-top: 20px;")
      QPagination(v-if="forms" v-model="page" :max="total" direction-links flat color="grey" active-color="primary")
   div(v-for="item in forms" style="margin-bottom: 10px;")
      div(class="finded")
         div(class="text-h6 q-mb-sm") Найдено: {{ item.form.surname }}
         QBtn(icon="edit" dense flat round @click="$router.push({path: `/list/${item._id}`, query: {edit: 'true'}})")
      QMarkupTable
         tbody
            tr(v-for="(key, value) in item.form")
               td {{ Constants.assistance[value] }}
               td {{ useBeautifyAssistance(key) }}
   div(style="display: flex; justify-content: center; margin-top: 20px;")
      QPagination(v-if="forms" v-model="page" :max="total" direction-links flat color="grey" active-color="primary")
</template>


<script setup lang="ts">
import type { AssistanceForm } from '@/types/interfaces'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch, useBeautifyAssistance } from '@/hooks'
import { AssistanceService } from '@/api/services'
import { Constants } from '@/util'


const limit = 1;
const router = useRouter();
const route = useRoute();
const total = ref(0);
const page = ref(1);
const search = ref(route.query.search?.toString() || '');
const { f: onFetchForms, error, loading, data: forms } = useFetch<{ _id: string, form: AssistanceForm }[]>({
   fn: () => AssistanceService.getForms(search.value, limit, page.value)
      .then((response) => {
         total.value = total.value = Math.ceil(+response.headers['x-total-count']! / limit);
         return response;
      }),
   errorMsg: 'Ничего не найдено',
});

onMounted(() => {
   if (search.value) {
      onFetchForms();
   }
});

watch([search, page], (n, o) => {
   error.value = '';
   if (n[0] !== o[0]) {
      router.push({ query: { search: search.value } });
   }
   if (n[1] !== o[1]) {
      onFetchForms().then(() => {
         window.scrollTo(0, 0);
      });
   }
   if (!n[0]) {
      router.push({ query: undefined });
   }
});
</script>

<style lang="scss" scoped>
.container {
   width: 50%;
   padding: 20px 0 20px 0;
   margin: 0 auto;

   & .title {
      text-align: center;
      margin: 10px 0 10px 0;
   }

   & .form {
      display: flex;
      flex-direction: column;
      align-items: center;

      & .form_input {
         width: 100%;
         margin-bottom: 10px;
      }
   }

   & .finded {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & i {
         cursor: pointer;

         &:hover {
            transform: scale(1.1);
         }
      }
   }
}

@media (max-width:1024px) {
   .container {
      width: 60%;
   }
}

@media (max-width:768px) {
   .container {
      width: 70%;
   }
}

@media (max-width:560px) {
   .container {
      width: 95%;
   }
}
</style>