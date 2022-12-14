<template lang="pug">
ModalWindow(:show="isDelModalVisible", @hide="showModal")
   h2(style="text-align: center;") Вы уверены?
   div(class="buttons")
      div(class="buttons_load")
         v-btn(class="confirm", @click="delHuman") Да
         LoadingWheel(class="wheel", v-if="isDelLoading")
      div(class="buttons_load")
         v-btn(class="confirm", @click="showModal") Нет
div(class="container")
   h1(class="title" style="margin-bottom: 10px") Полный список
   div(style="padding: 5px 0;")
      v-select(label="Сортировать", :items="sortOptions", v-model="humanStore.list.selectedSort", variant="solo")
      v-text-field(label="Поиск", v-model="humanStore.list.searchQuery", variant="solo")  
   v-list(v-if="humanStore.sortedAndSearchedHumansList.length", class="list")
      TransitionGroup(name="list") 
         v-list-item(
            v-for="(human, index) in humanStore.sortedAndSearchedHumansList", 
            :key="human._id",
            class="list_item"
            )
            template(#prepend)
               div(style="padding: 0 10px", class="list_number") {{index + 1 + '.'}}
            template(#append)
               div(class="list_buttons")
                  v-icon(tag="button", class="item_button", @click="copyFio(human.fio)") mdi-content-copy
                  v-icon(tag="button", class="item_button", @click="aboutHuman(human.fio)") mdi-magnify
                  v-icon(tag="button", class="item_button", @click="showModal(human._id)") mdi-delete-forever
            v-list-item-title(class="list_title", @click="$router.push(`/list/${human._id}`)") 
               v-tooltip(:text="human.fio", location="bottom") 
                  template(#activator="{ props }")
                     span(:="props") {{ human.fio }}
h3(class="error_message", v-if="isEmptyList") Список пуст
div(class="loading", v-if="isHumansLoading")
   LoadingWheel
div(class="observer")
   div(v-intersection="{ f: catchAllHumans, canLoad: () => canLoad }")
</template>


<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useStore } from '@/store/mainStore'
import { useRouter } from 'vue-router'
import { useHumanStore } from '@/store/humanStore'
import { useFetching } from '@/hooks/useFetching'
import AssistanceService from '@/api/services/AssistanceService'
import Util from '@/libs/Util'


const store = useStore();
const router = useRouter();
const humanStore = useHumanStore();
const canLoad = computed(() => humanStore.list.page < humanStore.list.total && !isHumansLoading.value);
const isEmptyList = computed(() => !humanStore.list.humansList.length ? true : false);
const isDelModalVisible = ref(false);
const humanId = ref('');
const sortOptions = ref([
   { value: '_id', title: 'По умолчанию' },
   { value: 'fio', title: 'По фамилии' },
]);

onMounted((): void => {
   if (!humanStore.list.humansList.length) {
      catchAllHumans();
   }
});

const { fetchFunc: catchAllHumans, isLoading: isHumansLoading } =
   useFetching({ callback: catchHumans, alert: false });
const { fetchFunc: delHuman, isLoading: isDelLoading } =
   useFetching({ callback: deleteHuman, successMessage: 'Удалено' });


async function catchHumans(): Promise<void> {
   humanStore.list.page++;
   const response = await AssistanceService.catchHumansList({ limit: humanStore.list.limit, page: humanStore.list.page });
   humanStore.list.total = Math.ceil(+response.headers['x-total-count']! / humanStore.list.limit);
   humanStore.list.humansList = [...humanStore.list.humansList, ...response.data.humansList];
}

async function deleteHuman() {
   if (store.alert.isVisible) store.showAlert(false);
   await AssistanceService.deleteHuman(humanId.value);
   showModal();
   humanStore.list.humansList = humanStore.list.humansList.filter(item => item._id !== humanId.value);
}

function showModal(id?: string): void {
   isDelModalVisible.value = !isDelModalVisible.value;
   if (!id) return;
   humanId.value = id;
}

async function copyFio(fio: string) {
   try {
      if (store.alert.isVisible) store.showAlert(false);
      const message = await Util.copyToClipboard(fio);
      store.setAlert('success', message);
   } catch (e) {
      store.setAlert('error', e as string);
   } finally {
      store.showAlert(true);
   }
}

function aboutHuman(fio: string) {
   router.push({ path: '/info', query: { search: fio } });
}
</script>


<style lang="scss" scoped>
.container {
   padding: 0 30px;
   width: 50%;
   margin: 0 auto;

   & .title {
      padding: 20px 0;
      text-align: center;
   }
}

.list_title {
   padding: 10px 10px;

   &:hover {
      color: teal;
      cursor: pointer;
   }
}

.list {
   overflow: hidden;
   padding: 0 0 0 0;

   &>*:not(:first-child) {
      margin-top: 5px;
   }

   & .list_item {
      border: 1px solid #dadce0;
      border-radius: 5px;
   }

   & .list_number {
      border-right: 1px solid #dadce0;
      padding: 10px 10px 10px 0px !important;
      display: flex;
      align-items: center;
   }

   & .list_buttons {
      border-left: 1px solid #dadce0;
      padding: 10px 0px 10px 10px !important;
   }
}

.buttons {
   display: flex;
   justify-content: space-between;
   padding: 30px 0 0 0;

   & .buttons_load {
      display: flex;
      align-items: center;
      padding: 5px;

      & .confirm {
         width: 65px;
      }

      & .wheel {
         margin-left: 5px;
      }
   }
}

.item_button {

   &:hover {
      transform: scale(1.1);
   }
}

.observer {
   padding: 1px;
   bottom: 0px;
}

.loading {
   display: flex;
   justify-content: center;
}

.error_message{
   color: var(--error-message-color);
   text-align: center;
}


@media(max-width: 768px) {
   .container {
      width: 100%;
   }
}

.list-item {
   display: inline-block;
   margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
   transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: translateY(30px);
}

.list-move {
   transition: transform 0.8s ease;
}
</style>