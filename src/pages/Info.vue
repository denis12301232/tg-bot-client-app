<template lang="pug">
HeaderLayout
   div(class="container")
      h4(class="title") Поиск
      form(class="form" @submit.prevent="onFetchForms")
         QInput(
            v-model="search" 
            class="form_input" 
            outlined 
            label="Имя или фамилия"
            :error="!!error"
            :error-message="error"
            )
         QBtn(color="primary" type="submit" :loading="loading") Найти
      div(v-for="item in forms" style="margin-bottom: 10px;")
         div(class="finded")
            div(class="text-h6") Найдено: {{ item.form.surname }}
            QIcon(name="edit" size="20px", @click="$router.push({path: `/list/${item._id}`, query: {edit: 'true'}})")
         QMarkupTable
            tbody
               tr(v-for="(key, value) in item.form")
                  td {{ value }}
                  td {{ key }}
</template>


<script setup lang="ts">
import type { AssistanceForm } from '@/types/interfaces'
import HeaderLayout from '@/layouts/HeaderLayout.vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services'


const router = useRouter();
const route = useRoute();
const search = ref(route.query.search?.toString() || '');
const { f: onFetchForms, error, loading, data: forms } = useFetch<{ _id: string, form: AssistanceForm }[]>({
   fn: () => AssistanceService.getForms(search.value),
   errorMsg: 'Ничего не найдено',
});

onMounted(() => {
   if (search.value) {
      onFetchForms();
   }
});

watch(search, () => {
   error.value = '';
   router.push({ query: { search: search.value } });
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
</style>