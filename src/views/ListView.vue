<template>
  <div class="column items-center q-pa-sm">
    <QDialog v-model="modal" :maximized="is !== 'filters'">
      <ListFilters v-if="is === 'filters'" v-model:query="filter" v-model:criterias="criterias" />
      <ListExport v-else-if="is === 'export'" :ids="ids" />
      <ListImport v-else />
    </QDialog>
    <QTable
      v-model:pagination="pagination"
      v-model:selected="select"
      :class="$style.table"
      :columns="columns"
      :rows="forms"
      :loading="loading || isDelLoading || isUpdating"
      :rows-per-page-options="[5, 10, 20, 50, 100, 1000]"
      binary-state-sort
      :pagination-label="(f, l, a) => `${f}-${l} ${t('extra.table.of')} ${a}`"
      :loading-label="t('extra.table.loading')"
      :no-data-label="t('extra.table.noData')"
      :rows-per-page-label="t('extra.table.show')"
      :no-results-label="t('extra.table.notFound')"
      :selected-rows-label="(n) => `${t('extra.table.selected')} ${n}`"
      :filter="filter"
      row-key="_id"
      separator="cell"
      :selection="visibleColumns.length ? 'multiple' : undefined"
      virtual-scroll
      :virtual-scroll-sticky-size-start="48"
      :visible-columns="visibleColumns"
      @request="request"
    >
      <template #top>
        <div class="row justify-between full-width items-center">
          <div class="text-h5 q-ml-md">{{ t('list.table.title') }}</div>
          <div>
            <QBtn icon="eva-more-horizontal-outline" flat round>
              <QTooltip class="bg-white text-black" :offset="[10, 10]" :delay="1000">
                {{ t('list.hints.columns') }}
              </QTooltip>
              <QMenu max-width="200px" anchor="bottom left" self="top middle">
                <QList>
                  <QItem v-for="column in columns" :key="(column.field as string)">
                    <QToggle v-model="visibleColumns" :val="column.field" :label="column.label" />
                  </QItem>
                </QList>
              </QMenu>
            </QBtn>
            <QFab direction="down" flat padding="10px" icon="eva-arrow-ios-downward-outline">
              <QFabAction icon="eva-cloud-upload-outline" color="green" @click="openModal('import')">
                <QTooltip class="bg-white text-black" :offset="[10, 10]" :delay="1000">
                  {{ t('list.hints.import') }}
                </QTooltip>
              </QFabAction>
              <QFabAction
                icon="eva-cloud-download-outline"
                color="orange"
                :disable="!select.length"
                @click="openModal('export')"
              >
                <QTooltip class="bg-white text-black" :offset="[10, 10]" :delay="1000">
                  {{ t('list.hints.export') }}
                </QTooltip>
              </QFabAction>
              <QFabAction icon="eva-options-outline" color="deep-orange" @click="openModal('filters')">
                <QTooltip class="bg-white text-black" :offset="[10, 10]" :delay="1000">
                  {{ t('list.hints.filter') }}
                </QTooltip>
              </QFabAction>
              <QFabAction
                icon="eva-trash"
                color="negative"
                :disable="loading || isDelLoading || !select.length"
                @click="onDelete(ids)"
              >
                <QTooltip class="bg-white text-black" :offset="[10, 10]" :delay="1000">
                  {{ t('list.hints.delete') }}
                </QTooltip>
              </QFabAction>
            </QFab>
          </div>
        </div>
      </template>
      <template #header-selection="scope">
        <QCheckbox v-model="scope.selected" dark />
      </template>
      <template #body="scope: { row: Responses.Assistance, rowIndex: number, selected: boolean }">
        <QTr :key="scope.row._id">
          <QTd v-if="visibleColumns.length">
            <QCheckbox v-model="scope.selected" />
          </QTd>
          <QTd :props="scope" key="sector">
            <QPopupEdit
              v-model="scope.row.sector"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.fields.sector.placeholder')"
                maxlength="100"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ scope.row.sector }}
          </QTd>
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
                  :label="t('home.form.fields.surname.placeholder')"
                  :rules="rules.surname"
                  lazy-rules
                  maxlength="100"
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
                  :label="t('home.form.fields.name.placeholder')"
                  :rules="rules.name"
                  lazy-rules
                  maxlength="100"
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
                  :label="t('home.form.fields.patronymic.placeholder')"
                  :rules="rules.patronymic"
                  lazy-rules
                  maxlength="100"
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
                  :label="t('home.form.fields.phone.placeholder')"
                  :rules="rules.phone"
                  type="tel"
                  mask="(###) ### - ####"
                  unmasked-value
                  fill-mask
                  prefix="+38"
                  lazy-rules
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
                  :label="t('home.form.fields.birth.placeholder')"
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
                          :locale="messages[locale].extra.calendar"
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
                  :label="t('home.form.fields.district.placeholder')"
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
                  :label="t('home.form.fields.street.placeholder')"
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
                  :label="t('home.form.fields.house.placeholder')"
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
                  :label="t('home.form.fields.flat.placeholder')"
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
          <QTd :props="scope" key="peopleCount">
            <QPopupEdit
              v-model="scope.row.peopleCount"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QForm @submit="props.set">
                <QInput
                  v-model.trim="props.value"
                  :label="t('home.form.fields.peopleCount.placeholder')"
                  :rules="rules.peopleCount"
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
            {{ Util.formatAssistanceValue(scope.row.peopleCount, 'peopleCount', t) }}
          </QTd>
          <QTd :props="scope" key="peopleFio">
            <QPopupEdit
              v-if="scope.row.peopleCount > 1"
              v-model="scope.row.peopleFio"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-for="i in scope.row.peopleCount - 1 > 10 ? 10 : scope.row.peopleCount - 1"
                v-model.trim="props.value[i - 1]"
                :key="i"
                :label="`${t('home.form.fields.peopleFio.placeholder')} ${i}-го`"
                maxlength="100"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.peopleFio, 'peopleFio', t) }}
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
          <QTd :props="scope" key="kidsAge">
            <QPopupEdit
              v-if="scope.row.kids"
              v-model="scope.row.kidsAge"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QOptionGroup v-model="props.value" type="checkbox" :options="kidsAgeOptions" color="indigo" />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.kidsAge, 'kidsAge', t) }}
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
          <QTd :props="scope" key="medicinesInfo">
            <QPopupEdit
              v-if="scope.row.medicines"
              v-model="scope.row.medicinesInfo"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.fields.medicinesInfo.placeholder')"
                maxlength="500"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.medicinesInfo, 'medicinesInfo', t) }}
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
          <QTd :props="scope" key="hygieneInfo">
            <QPopupEdit
              v-if="scope.row.hygiene"
              v-model="scope.row.hygieneInfo"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.fields.hygieneInfo.placeholder')"
                maxlength="500"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.hygieneInfo, 'hygieneInfo', t) }}
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
          <QTd :props="scope" key="pampersInfo">
            <QPopupEdit
              v-if="scope.row.pampers"
              v-model="scope.row.pampersInfo"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.fields.pampersInfo.placeholder')"
                maxlength="500"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.pampersInfo, 'pampersInfo', t) }}
          </QTd>
          <QTd :props="scope" key="extraInfo">
            <QPopupEdit
              v-model="scope.row.extraInfo"
              #default="props"
              @update:model-value="updateForm(scope.row, scope.row._id)"
            >
              <QInput
                v-model.trim="props.value"
                :label="t('home.form.fields.extraInfo.placeholder')"
                maxlength="500"
                counter
              />
              <div class="row justify-between">
                <QBtn icon="eva-checkmark-outline" dense flat round color="positive" @click="props.set" />
                <QBtn icon="eva-close-outline" dense flat round color="negative" @click="props.cancel" />
              </div>
            </QPopupEdit>
            {{ Util.formatAssistanceValue(scope.row.extraInfo, 'extraInfo', t) }}
          </QTd>
          <QTd :props="scope" key="personalDataAgreement">
            {{ Util.formatAssistanceValue(scope.row.personalDataAgreement, 'personalDataAgreement', t) }}
          </QTd>
          <QTd :props="scope" key="photoAgreement">
            {{ Util.formatAssistanceValue(scope.row.photoAgreement, 'photoAgreement', t) }}
          </QTd>
        </QTr>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import ListExport from '~/list/ListExport.vue';
import ListImport from '~/list/ListImport.vue';
import ListFilters from '~/list/ListFilters.vue';
import type { QTable } from 'quasar';
import type { Responses } from '@/types';
import { onMounted, ref, computed } from 'vue';
import { useRequest, useFetch, useAssistanceFormOptions } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Util, Rules } from '@/util';
import { useI18n } from 'vue-i18n';

type T = { acknowledged: boolean; deletedCount: number };
type S = (typeof AssistanceService)['deleteForms'];

const { t, messages, locale } = useI18n();
const rules = Rules.assistance(t);
const { districtOptions, yesNoOptions, kidsAgeOptions, getStreetOptions } = useAssistanceFormOptions();
const {
  request,
  pagination,
  data: forms,
  loading,
  filter,
} = useRequest<Responses.Assistance[]>(AssistanceService.getForms, {
  sort: '_id',
  descending: true,
  limit: 10,
  filters: { district: '', street: '', birth: { min: 1920, max: new Date().getFullYear() }, sector: '' },
});
const { request: onDelete, loading: isDelLoading } = useFetch<T, S>(AssistanceService.deleteForms, {
  afterResponse: ({ data }) => {
    data.value.acknowledged && request({ pagination: pagination.value });
    select.value.length = 0;
  },
});
const { request: updateForm, loading: isUpdating } = useFetch(AssistanceService.updateForm);
const criterias = ref<('district' | 'birth' | 'street' | 'sector')[]>([]);
const select = ref<Responses.Assistance[]>([]);
const modal = ref(false);
const is = ref<'import' | 'export' | 'filters'>('export');
const visibleColumns = ref([
  'sector',
  'name',
  'surname',
  'patronymic',
  'phone',
  'birth',
  'district',
  'street',
  'house',
  'flat',
  'peopleCount',
  'peopleFio',
  'invalids',
  'kids',
  'kidsAge',
  'food',
  'water',
  'medicines',
  'medicinesInfo',
  'hygiene',
  'hygieneInfo',
  'pampers',
  'pampersInfo',
  'extraInfo',
  'personalDataAgreement',
  'photoAgreement',
]);
const ids = computed(() => select.value.map((item) => item._id));
const columns = computed<QTable['columns']>(() => [
  {
    name: 'sector',
    label: t('home.form.fields.sector.value'),
    align: 'center',
    field: 'sector',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'surname',
    label: t('home.form.fields.surname.value'),
    align: 'center',
    field: 'surname',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'name',
    label: t('home.form.fields.name.value'),
    align: 'center',
    field: 'name',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'patronymic',
    label: t('home.form.fields.patronymic.value'),
    align: 'center',
    field: 'patronymic',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'phone',
    label: t('home.form.fields.phone.value'),
    align: 'center',
    field: 'phone',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'birth',
    label: t('home.form.fields.birth.value'),
    align: 'center',
    field: 'birth',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'district',
    label: t('home.form.fields.district.value'),
    align: 'center',
    field: 'district',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'street',
    label: t('home.form.fields.street.value'),
    align: 'center',
    field: 'street',
    headerStyle: 'font-size: 1.1em;',
    sortable: true,
  },
  {
    name: 'house',
    label: t('home.form.fields.house.value'),
    align: 'center',
    field: 'house',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'flat',
    label: t('home.form.fields.flat.value'),
    align: 'center',
    field: 'flat',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'peopleCount',
    label: t('home.form.fields.peopleCount.value'),
    align: 'center',
    field: 'peopleCount',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'peopleFio',
    label: t('home.form.fields.peopleFio.value'),
    align: 'center',
    field: 'peopleFio',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'invalids',
    label: t('home.form.fields.invalids.value'),
    align: 'center',
    field: 'invalids',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'kids',
    label: t('home.form.fields.kids.value'),
    align: 'center',
    field: 'kids',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'kidsAge',
    label: t('home.form.fields.kidsAge.value'),
    align: 'center',
    field: 'kidsAge',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'food',
    label: t('home.form.fields.food.value'),
    align: 'center',
    field: 'food',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'water',
    label: t('home.form.fields.water.value'),
    align: 'center',
    field: 'water',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'medicines',
    label: t('home.form.fields.medicines.value'),
    align: 'center',
    field: 'medicines',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'medicinesInfo',
    label: t('home.form.fields.medicinesInfo.value'),
    align: 'center',
    field: 'medicinesInfo',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'hygiene',
    label: t('home.form.fields.hygiene.value'),
    align: 'center',
    field: 'hygiene',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'hygieneInfo',
    label: t('home.form.fields.hygieneInfo.value'),
    align: 'center',
    field: 'hygieneInfo',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'pampers',
    label: t('home.form.fields.pampers.value'),
    align: 'center',
    field: 'pampers',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'pampersInfo',
    label: t('home.form.fields.pampersInfo.value'),
    align: 'center',
    field: 'pampersInfo',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'extraInfo',
    label: t('home.form.fields.extraInfo.value'),
    align: 'center',
    field: 'extraInfo',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'personalDataAgreement',
    label: t('home.form.fields.personalDataAgreement.value'),
    align: 'center',
    field: 'personalDataAgreement',
    headerStyle: 'font-size: 1.1em;',
  },
  {
    name: 'photoAgreement',
    label: t('home.form.fields.photoAgreement.value'),
    align: 'center',
    field: 'photoAgreement',
    headerStyle: 'font-size: 1.1em;',
  },
]);

onMounted(() => request({ pagination: pagination.value, filter: filter.value }));

function openModal(name: 'import' | 'export' | 'filters') {
  is.value = name;
  modal.value = true;
}
</script>

<style lang="scss" module>
.table {
  max-width: 1280px;
  width: 100%;
  max-height: calc(100vh - 115px);

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

.select {
  & span,
  & i {
    color: white;
  }
}

@media (max-width: 600px) {
  .table {
    max-height: calc(100vh - 67px);
  }
}
</style>
