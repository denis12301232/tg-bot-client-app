<template lang="pug">
v-modal(:show="deleteOptions.isModalVisible", @hide="showModal")
   div(class="title") Вы уверены?
   div(class="buttons")
      div(class="buttons_load")
         v-button(class="confirm", @click="deleteHuman") Да
         v-loading-wheel(class="wheel", v-if="deleteOptions.isLoading")
      div(class="buttons_load")
         v-button(class="confirm", @click="showModal") Нет
div(class="container")
   div(class="header")
      div(class="title") Список
      HumansListSelect(v-model="humanStore.list.selectedSort", :options="sortOptions")
   div(class="error", v-if="error") {{ error }}
   TransitionGroup(name="list")
      div(
         :class="['list', {'list_dark': dark, 'list_light': light}]", 
         v-for="(human, index) in humanStore.sortedHumansList", 
         :key="human._id"
         )
         div(class="list_item")
            div(class="item_number")
               div {{ index + 1 }}.
            div(class="item_name") {{ human.fio }}
            ButtonImage(
               class="item_button", 
               @click="aboutHuman(human.fio)", 
               image="images/info.png", 
               width="20px", 
               height="20px"
               )
            ButtonImage(
               class="item_button", 
               @click="showModal(human._id)", 
               image="images/delete-light.png", 
               width="20px", 
               height="20px"
               )
div(class="loading")
   v-loading-wheel(v-if="humanStore.list.isLoading")
div(class="observer")
   div(v-intersection="{ f: catchHumans, canLoad: () => canLoad }")
</template>


<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHumanStore } from '@/store/humanStore'
import AssistanceService from '@/api/services/AssistanceService'
import HumansListSelect from './HumansListSelect.vue'
import { useTheme } from '@/hooks/useTheme'


const { light, dark } = useTheme();
const router = useRouter();
const humanStore = useHumanStore();
const canLoad = computed(() => humanStore.list.page < humanStore.list.total && !humanStore.list.isLoading);
const error = ref('');
const sortOptions = ref([
   { value: '_id', name: 'По умолчанию' },
   { value: 'fio', name: 'По фамилии' },
]);
const deleteOptions = reactive({
   isModalVisible: false,
   isLoading: false,
   id: '',
});

onMounted((): void => {
   if (!humanStore.list.humansList.length) {
      catchHumans();
   }
});

async function catchHumans(): Promise<void> {
   try {
      error.value = '';
      humanStore.list.page++;
      humanStore.list.isLoading = true;
      const response = await AssistanceService.catchHumansList({ limit: humanStore.list.limit, page: humanStore.list.page });
      humanStore.list.total = Math.ceil(+response.headers['x-total-count'] / humanStore.list.limit);
      humanStore.list.humansList = [...humanStore.list.humansList, ...response.data.humansList];
      if (!humanStore.list.humansList.length) throw new Error('Список пуст');
   } catch (e: any) {
      error.value = e.message;
   } finally {
      humanStore.list.isLoading = false;
   }
}

function showModal(id?: string): void {
   deleteOptions.isModalVisible = !deleteOptions.isModalVisible;
   if (!id) return;
   deleteOptions.id = id;
}

function deleteHuman(): void {
   deleteOptions.isLoading = true;
   AssistanceService.deleteHuman(deleteOptions.id)
      .then(() => humanStore.list.humansList = humanStore.list.humansList.filter(item => item._id !== deleteOptions.id))
      .catch((e) => error.value = e?.response?.data?.message)
      .finally(() => {
         deleteOptions.isLoading = false;
         showModal();
      });
}

async function aboutHuman(fio: string): Promise<void> {
   humanStore.info.finded = [];
   humanStore.info.fio = fio;
   await router.push('/info');
   await humanStore.findHuman();
   window.scrollTo(0, 0);
}
</script>


<style lang="scss" scoped>
.title {
   text-align: center;
   font-size: 1.5em;
}

.container {
   padding: 10px;
   display: flex;
   flex-direction: column;
   align-items: center;

   & .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: 50%;
   }

   & .error {
      color: red;
      text-align: center;
      font-weight: bolder;
   }

   & .list {
      width: 50%;
      border: 1px solid #dadce0;
      margin-top: 10px;
      border-radius: 5px;

      & .list_item {
         display: flex;
         place-items: center;

         & .item_number {
            flex-basis: 3%;
            border-right: 1px solid #dadce0;
            padding: 5px 10px;
            align-self: stretch;
            display: flex;
            align-items: center;
         }

         & .item_name {
            flex-basis: 97%;
            padding: 10px 10px;
            word-break: break-word;
         }

         & .item_button {
            margin-right: 5px;
         }
      }
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

.observer {
   padding: 1px;
   bottom: 0px;
}

.loading {
   display: flex;
   justify-content: center;
}

.list_light {
   background-color: var(--background-color-light);
}

.list_dark {
   background-color: var(--background-color-dark);
}

@media(max-width: 768px) {
   .container {

      & .list,
      & .header {
         width: 90%;
      }
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