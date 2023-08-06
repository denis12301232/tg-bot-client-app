import type { I18n, Langs } from '@/types';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default function useAssistanceFormOptions() {
  const { messages, locale } = useI18n<I18n, Langs>();

  const districtOptions = computed(() =>
    messages.value[locale.value].extra.districts.map((item, index) => ({
      label: item,
      value: index,
    }))
  );

  function getStreetOptions(district: number | null) {
    return district?.toString().length
      ? messages.value[locale.value].extra.streets[district]
          .map((item, index) => ({
            label: item,
            value: index,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
  }
  const yesNoOptions = computed(() => [
    { label: messages.value[locale.value].home.form.checkboxes.yesNo[0], value: true },
    { label: messages.value[locale.value].home.form.checkboxes.yesNo[1], value: false },
  ]);

  const kidsAgeOptions = computed(() =>
    ['0-1', '1-3', '3-9', '9-18'].map((item, index) => ({
      label: messages.value[locale.value].home.form.checkboxes.kidsAge[index],
      value: item,
    }))
  );

  return { districtOptions, getStreetOptions, yesNoOptions, kidsAgeOptions };
}
