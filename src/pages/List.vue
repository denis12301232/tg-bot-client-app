<template lang="pug">
HeaderLayout
   div(class="container")
      QDialog(v-model="isDeleteModalVisible")
         QCard(style="padding: 10px; min-width: 250px;")
            QCardSection(class="text-h6 text-center") Вы уверены?
            QCardActions(align="between")
               QBtn(@click="onDeleteForm" :loading="isDeleteLoading" color="primary") Да
               QBtn(v-close-popup color="primary") Нет
      QInput(v-model="search" outlined label="Поиск" style="margin-top: 20px;")
      QTable(
         :rows="searchedList"
         :columns="columns"
         class="table"
         binary-state-sort
         separator="cell"
         row-key="index"
         hide-pagination
         :loading="loading"
         no-data-label="Ничего не найдено"
         )
         template(#body="{ row, rowIndex }")
            QTr
               QTd(key="name" auto-width) {{ rowIndex + 1 }}
               QTd(key="fio" ) {{ row.fio }}
               QTd(key="buttons" auto-width class="item_btns")
                  QIcon(name="content_copy" size="20px" @click="Util.copyTextToClipboard(row.fio)")
                  QIcon(name="search" size="20px" @click="findHuman(row.fio.split(' ')[0])")
                  QIcon(name="delete" size="20px" @click="[showDeleteModal(row._id)]")
      div(v-if="total > 1" style="display: flex; justify-content: center; margin-top: 20px;")
         QPagination(v-model="page" :max="total" direction-links flat color="grey" active-color="primary")
</template>


<script setup lang="ts">
import type { QTable } from 'quasar'
import type { HumansList } from '@/types/http'
import HeaderLayout from '@/layouts/HeaderLayout.vue'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '@/hooks'
import { AssistanceService } from '@/api/services'
import { Util } from '@/util'

const columns: QTable['columns'] = [
   { name: 'index', label: 'Номер', align: 'left', field: 'index' },
   { name: 'fio', label: 'ФИО', align: 'left', field: 'fio', sortable: true, sort: (a, b) => a.localeCompare(b) },
   { name: 'buttons', label: 'Действия', align: 'center', field: 'buttons' },
];
const router = useRouter();
const page = ref(1);
const search = ref('');
const total = ref(0);
const limit = ref(3);
const currentId = ref('');
const isDeleteModalVisible = ref(false);
const searchedList = computed(() => {
   return list.value?.filter(item => item.fio.toLowerCase().includes(search.value.toLowerCase()));
});
const { f: onDeleteForm, loading: isDeleteLoading } = useFetch({
   fn: () => AssistanceService.deleteFormById(currentId.value)
      .then(() => {
         showDeleteModal();
         list.value = list.value?.filter(item => item._id !== currentId.value);
      }),
   alert: true,
   successMsg: 'Удалено'
});
const { f: onFetchHumansList, data: list, loading } = useFetch<HumansList[]>({
   fn: () => AssistanceService.catchHumansList({ limit: limit.value, page: page.value })
      .then((response) => {
         total.value = Math.ceil(+response.headers['x-total-count']! / limit.value);
         return response;
      }),
})

watch(page, () => {
   onFetchHumansList();
}, { immediate: true });

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

   & .table {
      margin-top: 20px;
   }

   & .item_btns {
      &>* {
         cursor: pointer;
         padding: 0 2px 0 2px;

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