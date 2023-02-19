<template lang="pug">
HeaderLayout
   div(class="container")
      QDialog(v-model="isDeleteModalVisible")
         QCard(style="padding: 10px; min-width: 250px;")
            QCardSection(class="text-h6 text-center") Вы уверены?
            QCardActions(align="between")
               QBtn(@click="onDeleteForm" :loading="isDeleteLoading" color="primary") Да
               QBtn(v-close-popup color="primary") Нет
      h4(class="title") Полный список
      QTable(
         class="table"
         :columns="columns"
         :rows="list"
         :loading="isLoading"
         :pagination-label="(f, l, t) => `${f}-${l} из ${t}`"
         :filter="filter"
         :rows-per-page-options="[5, 10, 20, 50]"
         binary-state-sort
         loading-label="Загрузка..."
         no-data-label="Ничего не найдено"
         rows-per-page-label="Отображать:"
         no-results-label="Ничего не найдено"
         row-key="index"
         separator="cell"
         v-model:pagination="pagination"
         @request="onRequest"
         )
         template(#body="{ row, rowIndex }")
            QTr
               QTd(key="name" class="text-center" auto-width) {{ rowIndex + 1 }}
               QTd(key="fio" class="item_fio" @click="$router.push(`/list/${row._id}`)") {{ row.fio }}
               QTd(key="buttons" class="item_btns" auto-width)
                  QIcon(name="content_copy" size="20px" @click="Util.copyTextToClipboard(row.fio)")
                  QIcon(name="search" size="20px" @click="findHuman(row.fio.split(' ')[0])")
                  QIcon(name="delete" size="20px" @click="[showDeleteModal(row._id)]")
         template(#top)
            QInput(borderless dense clearable debounce="300" v-model="filter" placeholder="Поиск" style="width: 100%;")
               template(#append)
                  QIcon(name="search")
</template>
   
<script setup lang="ts">
import type { QTable } from 'quasar'
import type { HumansList } from '@/types/http'
import HeaderLayout from '@/layouts/HeaderLayout.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '@/hooks'
import { AssistanceService } from '@/api/services'
import { Util } from '@/util'


interface Pagination {
   sortBy: string;
   descending: boolean;
   page: number;
   rowsPerPage: number;
}

const router = useRouter();
const isLoading = ref(false);
const list = ref<HumansList[]>([]);
const filter = ref('');
const currentId = ref('');
const isDeleteModalVisible = ref(false);
const pagination = ref({
   sortBy: 'desc',
   descending: true,
   page: 1,
   rowsPerPage: 10, // limit
   rowsNumber: 0 // total
});

const columns: QTable['columns'] = [
   { name: 'index', label: 'Номер', align: 'center', field: 'index', headerStyle: 'font-size: 1.1em;' },
   { name: 'fio', label: 'ФИО', align: 'center', field: 'fio', headerStyle: 'font-size: 1.1em;', sortable: true },
   { name: 'buttons', label: 'Действия', align: 'center', field: 'buttons', headerStyle: 'font-size: 1.1em;' },
];
const { f: onDeleteForm, loading: isDeleteLoading } = useFetch({
   fn: () => AssistanceService.deleteFormById(currentId.value)
      .then(() => {
         showDeleteModal();
         list.value = list.value?.filter(item => item._id !== currentId.value);
         pagination.value.rowsNumber--;
      }),
   alert: true,
   successMsg: 'Удалено'
});

onMounted(() => onRequest({ pagination: pagination.value }));

async function onRequest(props: { pagination: Pagination, filter?: any }) {
   try {
      isLoading.value = true;
      const { page, rowsPerPage, sortBy, descending } = props.pagination;

      if (sortBy && descending !== pagination.value.descending) {
         const sortFn = descending
            ? (a: { [name: string]: string }, b: { [name: string]: string }) => (b[sortBy].localeCompare(a[sortBy]))
            : (a: { [name: string]: string }, b: { [name: string]: string }) => (a[sortBy].localeCompare(b[sortBy]));
         list.value.sort(sortFn);
         pagination.value.descending = descending;
         pagination.value.sortBy = sortBy;
         return;
      }
      const response = await AssistanceService.catchHumansList({ limit: rowsPerPage, page: page, filter: props.filter });
      list.value.splice(0, list.value.length, ...response.data);
      pagination.value = { ...props.pagination, rowsNumber: Number(response.headers['x-total-count']) }
   } catch (e) {
      console.log(e);
   } finally {
      isLoading.value = false;
   }
}

function findHuman(surname: string) {
   router.push({ path: '/info', query: { search: surname } });
}

function showDeleteModal(id?: string) {
   if (id) {
      currentId.value = id;
   }
   isDeleteModalVisible.value = !isDeleteModalVisible.value;
}
</script>
   
<style scoped lang="scss">
.container {
   width: 50%;
   margin: 0 auto;
   margin-bottom: 10px;

   & .title {
      text-align: center;
      margin: 20px 0 20px 0;
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
            color: $teal;
         }
      }
   }

   & .item_fio {
      cursor: pointer;

      &:hover {
         color: $teal;
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