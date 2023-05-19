<template>
  <div class="container">
    <QDialog v-model="modal">
      <QCard style="padding: 10px; min-width: 250px">
        <QCardSection>
          <h5 class="text-center">Удалить?</h5>
        </QCardSection>
        <QCardActions align="between">
          <QBtn dense flat round :loading="isDeleteLoading" color="positive" icon="done" @click="onDeleteForm" />
          <QBtn v-close-popup dense flat round color="negative" icon="close" />
        </QCardActions>
      </QCard>
    </QDialog>
    <h4 class="text-center q-my-md">Полный список</h4>
    <QTable
      v-model:pagination="pagination"
      class="q-mt-lg"
      :columns="columns"
      :rows="list"
      :loading="loading"
      :pagination-label="(f, l, t) => `${f}-${l} из ${t}`"
      :filter="filter"
      :rows-per-page-options="[5, 10, 20, 50]"
      binary-state-sort
      loading-label="Загрузка..."
      no-data-label="Ничего не найдено"
      rows-per-page-label="Отображать:"
      no-results-label="Ничего не найдено"
      row-key="_id"
      separator="cell"
      @request="onRequest"
    >
      <template #body="{ row, rowIndex }: { row: HumansList, rowIndex: number }">
        <QTr :key="row._id">
          <QTd class="text-center" auto-width>{{ rowIndex + 1 }}</QTd>
          <QTd class="item_fio" @click="$router.push(`/list/${row._id}`)">{{ row.fio }}</QTd>
          <QTd auto-width>
            <QBtnGroup flat>
              <QBtn dense round flat icon="content_copy" color="indigo" @click="Util.copyTextToClipboard(row.fio)" />
              <QBtn dense round flat icon="search" color="teal" @click="findHuman(row.fio.split(' ')[0])" />
              <QBtn dense round flat icon="delete" color="negative" @click="showDeleteModal(row._id)" />
            </QBtnGroup>
          </QTd>
        </QTr>
      </template>
      <template #top>
        <QInput class="full-width" v-model="filter" debounce="300" borderless dense clearable placeholder="Поиск">
          <template #append>
            <QIcon name="search" />
          </template>
        </QInput>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { QTable } from 'quasar';
import type { HumansList } from '@/types';
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch, useRequest } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Util } from '@/util';

onMounted(() => onRequest({ pagination: pagination.value }));

const router = useRouter();
const currentId = ref('');
const modal = ref(false);
const { pagination, loading, data: list, filter, onRequest } = useRequest<HumansList>({
  f: AssistanceService.catchHumansList,
  sort: 'fio',
  descending: false,
});
const { f: onDeleteForm, loading: isDeleteLoading } = useFetch({
  fn: deleteHuman,
  alert: true,
  successMsg: 'Удалено',
});
const columns: QTable['columns'] = [
  { name: 'index', label: 'Номер', align: 'center', field: 'index', headerStyle: 'font-size: 1.1em;' },
  { name: 'fio', label: 'ФИО', align: 'center', field: 'fio', headerStyle: 'font-size: 1.1em;', sortable: true },
  { name: 'buttons', label: 'Действия', align: 'center', field: 'buttons', headerStyle: 'font-size: 1.1em;' },
];

async function deleteHuman() {
  await AssistanceService.deleteFormById(currentId.value);
  modal.value = false;
  list.value = list.value?.filter((item) => item._id !== currentId.value);
  pagination.value.rowsNumber--;
  pagination.value.rowsPerPage--;
}

function findHuman(surname: string) {
  router.push({ path: '/info', query: { search: surname } });
}

function showDeleteModal(id?: string) {
  if (id) {
    currentId.value = id;
    ``;
  }
  modal.value = !modal.value;
}
</script>

<style scoped lang="scss">
.container {
  width: 50%;
  margin: 0 auto;
  margin-bottom: 10px;

  & .item_fio {
    cursor: pointer;

    &:hover {
      color: $teal;
    }
  }
}

@media (max-width: 1024px) {
  .container {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .container {
    width: 70%;
  }
}

@media (max-width: 560px) {
  .container {
    width: 95%;
  }
}
</style>
