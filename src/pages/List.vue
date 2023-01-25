<template lang="pug">
HeaderLayout
   div(class="container")
      QDialog(v-model="isDeleteModalVisible")
         QCard(style="padding: 10px; min-width: 250px;")
            QCardSection(class="text-h6 text-center") Вы уверены?
            QCardActions(align="between")
               QBtn(@click="onDeleteForm" :loading="isDeleteLoading") Да
               QBtn(v-close-popup) Нет
      h4(class="title") Список
      QSelect(v-model="sort" outlined :options="sortOptions" label="Сортировать")
      QInput(v-model="search" outlined label="Поиск" style="margin-top: 5px;")
      QInfiniteScroll(@load="fetchHumansList")
         h5(v-if="!sortedAndSearchedList.length" class="text-center text-negative") Ничего не найдено
         QList(v-else bordered class="list")
            div(v-for="(user, index) in sortedAndSearchedList" class="list_item")
               div(class="item_num") {{ index + 1 }}
               div(class="item_fio") {{ user.fio }}
               div(class="item_btns")
                  QIcon(name="content_copy" size="20px" @click="Util.copyTextToClipboard(user.fio)")
                  QIcon(name="search" size="20px" @click="findHuman(user.fio.split(' ')[0])")
                  QIcon(name="delete" size="20px" @click="[showDeleteModal(user._id)]")
         template(#loading)
            div(class="row justify-center q-my-md")
               QSpinnerDots(color="primary" size="40px")
</template>


<script setup lang="ts">
import type { HumansList } from '@/types/http'
import HeaderLayout from '@/layouts/HeaderLayout.vue'
import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '@/hooks'
import { AssistanceService } from '@/api/services'
import { Util } from '@/util'


const router = useRouter();
const sort = ref<{ value: '_id' | 'fio' } | null>(null);
const search = ref('');
const list = ref<HumansList[]>([]);
const total = ref(0);
const limit = ref(10);
const currentId = ref('');
const isDeleteModalVisible = ref(false);
const sortOptions = [
   { label: 'По умолчанию', value: '_id' },
   { label: 'По фамилии', value: 'fio' }
];
const sortedList = computed(() => {
   if (!sort.value?.value) {
      return list.value;
   } else {
      return list.value.sort((a, b) => {
         return a[sort.value!.value].localeCompare(b[sort.value!.value]);
      });
   }
});
const sortedAndSearchedList = computed(() => {
   return sortedList.value.filter(item => item.fio.toLowerCase().includes(search.value.toLowerCase()));
});
const { f: onDeleteForm, loading: isDeleteLoading, success } = useFetch({
   fn: () => AssistanceService.deleteFormById(currentId.value).then(() => showDeleteModal()),
   alert: true,
   successMsg: 'Удалено'
});

watchEffect(() => {
   if (!isDeleteLoading.value && success.value === 'Удалено') {
      list.value = list.value.filter(item => item._id !== currentId.value);
   }
});

async function fetchHumansList(index: number, done: (stop?: boolean | undefined) => void) {
   const response = await AssistanceService.catchHumansList({ limit: limit.value, page: index });
   total.value = Math.ceil(+response.headers['x-total-count']! / limit.value)
   list.value = [...list.value, ...response.data];
   total.value === index ? done(true) : done();
}

function showDeleteModal(id?: string) {
   if (id) {
      currentId.value = id;
   }
   isDeleteModalVisible.value = !isDeleteModalVisible.value;
}

function findHuman(surname: string) {
   router.push({ path: '/info', query: { search: surname } });
}
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

   & .list {
      margin-top: 10px;
      font-size: 1.1em;
      border-radius: 5px;

      & .list_item {
         padding: 10px;
         display: flex;
         align-items: center;


         & .item_num {
            min-width: 50px;
            width: 10%;
            border-right: 1px solid #ccc;
            padding: 5px 10px 5px 0;
            text-align: center;
         }

         & .item_fio {
            min-width: 100px;
            width: 70%;
            padding: 5px;
            border-right: 1px solid #ccc;

            &:hover {
               color: $secondary;
               cursor: pointer;
            }
         }

         & .item_btns {
            display: flex;
            justify-content: center;
            min-width: 100px;
            width: 20%;
            padding: 5px;

            &>* {
               cursor: pointer;
               padding: 0 2px 0 2px;

               &:hover {
                  transform: scale(1.1);
               }
            }
         }
      }
   }
}
</style>