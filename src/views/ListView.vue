<template>
  <div class="column items-center q-pa-sm">
    <QDialog v-model="modal" maximized>
      <component :is="component" />
    </QDialog>
    <QTable
      v-model:pagination="pagination"
      v-model:selected="select"
      :class="$style.table"
      :columns="columns"
      :rows="forms"
      :loading="loading || isDelLoading || isUpdating"
      :rows-per-page-options="[5, 10, 20, 50]"
      binary-state-sort
      :pagination-label="(f, l, a) => `${f}-${l} ${t('table.of')} ${a}`"
      :loading-label="t('table.loading')"
      :no-data-label="t('table.noData')"
      :rows-per-page-label="t('table.show')"
      :no-results-label="t('table.notFound')"
      :selected-rows-label="(n) => `${t('table.selected')} ${n}`"
      row-key="_id"
      separator="cell"
      selection="multiple"
      virtual-scroll
      :virtual-scroll-sticky-size-start="48"
      @request="request"
    >
      <template #top>
        <div class="row">
          <QBtn color="white" round flat dense icon="eva-arrow-down">
            <QMenu auto-close>
              <QList>
                <QItem clickable @click="openModal('import')">
                  <QItemSection avatar>
                    <QIcon color="green" name="eva-cloud-upload-outline" />
                  </QItemSection>
                  <QItemSection>Import</QItemSection>
                </QItem>
                <QItem clickable @click="openModal('export')">
                  <QItemSection avatar>
                    <QIcon color="red" name="eva-cloud-download-outline" />
                  </QItemSection>
                  <QItemSection>Export</QItemSection>
                </QItem>
              </QList>
            </QMenu>
          </QBtn>
          <div class="text-h5 q-ml-md">{{ t('list.title') }}</div>
        </div>
      </template>
      <template #header-selection>
        <QBtn
          dense
          round
          flat
          icon="eva-trash"
          color="negative"
          :disable="loading || isDelLoading || !select.length"
          @click="onDelete(ids)"
        >
          <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('list.hints.delete') }}</QTooltip>
        </QBtn>
      </template>
      <template #body="scope: { row: AssistanceResponse, rowIndex: number, selected: boolean }">
        <QTr :key="scope.row._id">
          <QTd><QCheckbox v-model="scope.selected" /></QTd>
          <QTd class="text-center" auto-width>{{ scope.rowIndex + 1 }}</QTd>
          <QTd :props="scope" key="surname">
            <QPopupEdit
              v-model="scope.row.surname"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model="props.value"
                  dense
                  autofocus
                  counter
                  :label="t('home.form.placeholders.surname')"
                  :rules="rules.surname"
                  lazy-rules
                  maxlength="50"
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.surname, 'surname', t) }}
          </QTd>
          <QTd :props="scope" key="name">
            <QPopupEdit
              v-model="scope.row.name"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model="props.value"
                  dense
                  autofocus
                  counter
                  :label="t('home.form.placeholders.name')"
                  :rules="rules.name"
                  lazy-rules
                  maxlength="50"
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.name, 'name', t) }}
          </QTd>
          <QTd :props="scope" key="patronymic">
            <QPopupEdit
              v-model="scope.row.patronymic"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model="props.value"
                  dense
                  autofocus
                  counter
                  :label="t('home.form.placeholders.patronymic')"
                  :rules="rules.patronymic"
                  lazy-rules
                  maxlength="50"
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.patronymic, 'patronymic', t) }}
          </QTd>
          <QTd :props="scope" key="phone">
            <QPopupEdit
              v-model="scope.row.phone"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model="props.value"
                  :label="t('home.form.placeholders.phone')"
                  :rules="rules.phone"
                  type="tel"
                  mask="(###) ### - ####"
                  unmasked-value
                  fill-mask
                  prefix="+38"
                  lazy-rules
                  maxlength="50"
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.phone, 'phone', t) }}
          </QTd>
          <QTd :props="scope" key="birth">
            <QPopupEdit
              v-model="scope.row.birth"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model="props.value"
                  :label="t('home.form.placeholders.birth')"
                  mask="date"
                  :rules="rules.birth"
                  lazy-rules
                  @keyup.enter="props.set"
                >
                  <template #append>
                    <QIcon class="cursor-pointer" name="eva-calendar">
                      <QPopupProxy cover transition-show="scale" transition-hide="scale">
                        <QDate
                          v-model="props.value"
                          emit-immediately
                          default-year-month="2000/12"
                          color="primary"
                          :locale="messages[locale].calendar"
                        >
                          <div class="row items-center justify-end">
                            <QBtn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </QDate>
                      </QPopupProxy>
                    </QIcon>
                  </template>
                </QInput>
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.birth, 'birth', t) }}
          </QTd>
          <QTd :props="scope" key="district">
            <QPopupEdit
              v-model="scope.row.district"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QSelect
                  v-model="props.value"
                  :label="t('home.form.placeholders.district')"
                  :rules="rules.district"
                  :options="districtOptions"
                  lazy-rules
                  emit-value
                  map-options
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.district, 'district', t) }}
          </QTd>
          <QTd :props="scope" key="street">
            <QPopupEdit
              v-model="scope.row.street"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QSelect
                  v-model.trim="props.value"
                  :label="t('home.form.placeholders.street')"
                  :rules="rules.street"
                  :options="getStreetOptions(scope.row.district)"
                  lazy-rules
                  map-options
                  emit-value
                  @keyup.enter="props.set"
                >
                  <template #no-option>
                    <QItem>
                      <QItemSection class="text-negative">{{ t('assistance.msgs.selectDistrict') }}</QItemSection>
                    </QItem>
                  </template>
                </QSelect>
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.street, 'street', t, scope.row.district) }}
          </QTd>
          <QTd :props="scope" key="house">
            <QPopupEdit
              v-model="scope.row.house"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model.trim="props.value"
                  :label="t('home.form.placeholders.house')"
                  :rules="rules.house"
                  lazy-rules
                  maxlength="50"
                  counter
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.house, 'house', t) }}
          </QTd>
          <QTd :props="scope" key="flat">
            <QPopupEdit
              v-model="scope.row.flat"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model.trim="props.value"
                  :label="t('home.form.placeholders.flat')"
                  :rules="rules.flat"
                  lazy-rules
                  maxlength="50"
                  counter
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.flat, 'flat', t) }}
          </QTd>
          <QTd :props="scope" key="people_num">
            <QPopupEdit
              v-model="scope.row.people_num"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model.trim="props.value"
                  :label="t('home.form.placeholders.peopleNum')"
                  :rules="rules.people_num"
                  lazy-rules
                  maxlength="2"
                  counter
                  @keyup.enter="props.set"
                />
                <div class="row justify-between">
                  <QBtn type="submit" icon="eva-checkmark-outline" dense flat round color="positive" />
                  <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
                </div>
              </QForm>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.people_num, 'people_num', t) }}
          </QTd>
          <QTd :props="scope" key="people_fio">
            <QPopupEdit
              v-if="Number(scope.row.people_num) > 1"
              v-model="scope.row.people_fio"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-for="i in Number(scope.row.people_num) - 1 > 10 ? 10 : Number(scope.row.people_num) - 1"
                v-model.trim="props.value[i - 1]"
                :key="i"
                :label="`${t('home.form.placeholders.peopleFio')} ${i}-го`"
                maxlength="50"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.people_fio, 'people_fio', t) }}
          </QTd>
          <QTd :props="scope" key="invalids">
            <QPopupEdit
              v-model="scope.row.invalids"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" :options="yesNoOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.invalids, 'invalids', t) }}
          </QTd>
          <QTd :props="scope" key="kids">
            <QPopupEdit
              v-model="scope.row.kids"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" :options="yesNoOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.kids, 'kids', t) }}
          </QTd>
          <QTd :props="scope" key="kids_age">
            <QPopupEdit
              v-if="scope.row.kids"
              v-model="scope.row.kids_age"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" type="checkbox" :options="kidsAgeOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.kids_age, 'kids_age', t) }}
          </QTd>
          <QTd :props="scope" key="food">
            <QPopupEdit
              v-model="scope.row.food"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" :options="yesNoOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.food, 'food', t) }}
          </QTd>
          <QTd :props="scope" key="water">
            <QPopupEdit
              v-model="scope.row.water"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" :options="yesNoOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.water, 'water', t) }}
          </QTd>
          <QTd :props="scope" key="medicines">
            <QPopupEdit
              v-model="scope.row.medicines"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" :options="yesNoOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.medicines, 'medicines', t) }}
          </QTd>
          <QTd :props="scope" key="medicines_info">
            <QPopupEdit
              v-if="scope.row.medicines"
              v-model="scope.row.medicines_info"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.placeholders.medicinesInfo')"
                maxlength="50"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.medicines_info, 'medicines_info', t) }}
          </QTd>
          <QTd :props="scope" key="hygiene">
            <QPopupEdit
              v-model="scope.row.hygiene"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" :options="yesNoOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.hygiene, 'hygiene', t) }}
          </QTd>
          <QTd :props="scope" key="hygiene_info">
            <QPopupEdit
              v-if="scope.row.hygiene"
              v-model="scope.row.hygiene_info"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.placeholders.hygieneInfo')"
                maxlength="50"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.hygiene_info, 'hygiene_info', t) }}
          </QTd>
          <QTd :props="scope" key="pampers">
            <QPopupEdit
              v-model="scope.row.pampers"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" :options="yesNoOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.pampers, 'pampers', t) }}
          </QTd>
          <QTd :props="scope" key="pampers_info">
            <QPopupEdit
              v-if="scope.row.pampers"
              v-model="scope.row.pampers_info"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.placeholders.pampersInfo')"
                maxlength="50"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.pampers_info, 'pampers_info', t) }}
          </QTd>
          <QTd :props="scope" key="diet">
            <QPopupEdit
              v-model="scope.row.diet"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput v-model.trim="props.value" :label="t('home.form.placeholders.diet')" maxlength="50" counter />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.diet, 'diet', t) }}
          </QTd>
          <QTd>{{ Util.formatAssistanceValue(scope.row.pers_data_agreement, 'pers_data_agreement', t) }}</QTd>
          <QTd>{{ Util.formatAssistanceValue(scope.row.photo_agreement, 'photo_agreement', t) }}</QTd>
        </QTr>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import ListExport from '~/list/ListExport.vue';
import ListImport from '~/list/ListImport.vue';
import type { QTable } from 'quasar';
import type { AssistanceResponse, I18n, Langs } from '@/types';
import { onMounted, ref, computed, shallowRef, watch, type Component } from 'vue';
import { useRequest, useFetch, useAssistanceFormOptions } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Util, Rules } from '@/util';
import { useI18n } from 'vue-i18n';

type T = { acknowledged: boolean; deletedCount: number };
type S = (typeof AssistanceService)['deleteForms'];

const { t, messages, locale } = useI18n<I18n, Langs>();
const rules = Rules.assistance(t);
const { districtOptions, yesNoOptions, kidsAgeOptions, getStreetOptions } = useAssistanceFormOptions();
const {
  request,
  pagination,
  data: forms,
  loading,
} = useRequest<AssistanceResponse[]>(AssistanceService.getForms, {
  sort: '_id',
  descending: true,
  limit: 10,
});
const { request: onDelete, loading: isDelLoading } = useFetch<T, S>(AssistanceService.deleteForms, {
  afterResponse: ({ data }) => {
    data.value.acknowledged && request({ pagination: pagination.value });
    select.value.length = 0;
  },
});

const { request: updateForm, loading: isUpdating } = useFetch(AssistanceService.updateForm);
const select = ref<AssistanceResponse[]>([]);
const modal = ref(false);
const is = ref<'import' | 'export'>('export');
const component = shallowRef<Component>(ListExport);
const ids = computed(() => select.value.map((item) => item._id));

onMounted(() => request({ pagination: pagination.value }));
watch(is, () => {
  if (is.value === 'export') {
    component.value = ListExport;
  } else {
    component.value = ListImport;
  }
});

function openModal(name: 'import' | 'export') {
  is.value = name;
  modal.value = true;
}

const columns = computed<QTable['columns']>(() => [
  {
    name: 'index',
    label: t('list.table.columns.number'),
    align: 'center',
    field: 'index',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'surname',
    label: t('assistance.fields.surname'),
    align: 'center',
    field: 'fio',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'name',
    label: t('assistance.fields.name'),
    align: 'center',
    field: 'name',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'patronymic',
    label: t('assistance.fields.patronymic'),
    align: 'center',
    field: 'patronymic',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'phone',
    label: t('assistance.fields.phone'),
    align: 'center',
    field: 'phone',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'birth',
    label: t('assistance.fields.birth'),
    align: 'center',
    field: 'birth',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'district',
    label: t('assistance.fields.district'),
    align: 'center',
    field: 'district',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'street',
    label: t('assistance.fields.street'),
    align: 'center',
    field: 'street',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'house',
    label: t('assistance.fields.house'),
    align: 'center',
    field: 'house',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'flat',
    label: t('assistance.fields.flat'),
    align: 'center',
    field: 'flat',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'people_num',
    label: t('assistance.fields.people_num'),
    align: 'center',
    field: 'people_num',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'people_fio',
    label: t('assistance.fields.people_fio'),
    align: 'center',
    field: 'people_fio',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'invalids',
    label: t('assistance.fields.invalids'),
    align: 'center',
    field: 'invalids',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'kids',
    label: t('assistance.fields.kids'),
    align: 'center',
    field: 'kids',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'kids_age',
    label: t('assistance.fields.kids_age'),
    align: 'center',
    field: 'kids_age',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'food',
    label: t('assistance.fields.food'),
    align: 'center',
    field: 'food',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'water',
    label: t('assistance.fields.water'),
    align: 'center',
    field: 'water',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'medicines',
    label: t('assistance.fields.medicines'),
    align: 'center',
    field: 'medicines',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'medicines_info',
    label: t('assistance.fields.medicines_info'),
    align: 'center',
    field: 'medicines_info',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'hygiene',
    label: t('assistance.fields.hygiene'),
    align: 'center',
    field: 'hygiene',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'hygiene_info',
    label: t('assistance.fields.hygiene_info'),
    align: 'center',
    field: 'hygiene_info',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'pampers',
    label: t('assistance.fields.pampers'),
    align: 'center',
    field: 'pampers',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'pampers_info',
    label: t('assistance.fields.pampers_info'),
    align: 'center',
    field: 'pampers_info',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'diet',
    label: t('assistance.fields.diet'),
    align: 'center',
    field: 'diet',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'pers_data_agreement',
    label: t('assistance.fields.pers_data_agreement'),
    align: 'center',
    field: 'pers_data_agreement',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'photo_agreement',
    label: t('assistance.fields.photo_agreement'),
    align: 'center',
    field: 'photo_agreement',
    headerStyle: 'font-size: 1.1em;',
  },
]);
</script>

<style lang="scss" module>
.table {
  max-width: 1280px;
  width: 100%;
  max-height: 670px;
  & thead tr th {
    position: sticky;
    z-index: 1;
  }
  /* bg color is important for th; just specify one */
  & :global(.q-table__top) {
    background-color: $indigo;
    color: white;
  }
  & thead tr:first-child th {
    background-color: $indigo;
    color: white;
  }

  /* this will be the loading indicator */
  & thead tr:last-child th {
    top: 48px;
  }
  /* height of all previous header rows */

  & thead tr:first-child th {
    top: 0;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    scroll-margin-top: 48px;
  }
  /* height of all previous header rows */
}
</style>
