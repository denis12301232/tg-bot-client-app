import type { I18n, Langs } from '@/types';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default function useAssistanceFormOptions() {
  const { messages, locale } = useI18n<I18n, Langs>();

  const districtOptions = computed(() =>
    Object.entries(messages.value[locale.value].assistance.districts).map(([key, value]) => ({
      label: value,
      value: key,
    }))
  );

  function getStreetOptions(district: string) {
    return district
      ? Object.entries(messages.value[locale.value].assistance.streets[district as '1'])
          .map(([key, value]) => ({ label: value, value: key }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
  }

  const yesNoOptions = computed(() =>
    Object.entries(messages.value[locale.value].assistance.checkboxes.yesNo).map(([key, value]) => ({
      label: value,
      value: key,
    }))
  );
  const kidsAgeOptions = computed(() =>
    Object.entries(messages.value[locale.value].assistance.checkboxes.kidsAge).map(([key, value]) => ({
      label: value,
      value: key,
    }))
  );

  return { districtOptions, getStreetOptions, yesNoOptions, kidsAgeOptions };
}
