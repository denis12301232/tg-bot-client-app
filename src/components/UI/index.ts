import VButton from '@/components/UI/v-button.vue'
import VBurger from '@/components/UI/VBurger.vue'
import VLoadingWheel from '@/components/UI/v-loading-wheel.vue'
import VModal from '@/components/UI/v-modal.vue'
import VInputFind from '@/components/UI/v-input-find.vue'
import VCheckbox from '@/components/UI/v-checkbox.vue'
import VRadio from '@/components/UI/v-radio.vue'
import VSelectDistrict from '@/components/UI/v-select-district.vue'
import VInput from '@/components/UI/v-input.vue'
import VSelect from '@/components/UI/v-select.vue'
import ButtonImage from '@/components/UI/ButtonImage.vue'

VButton.name = 'v-button';
VLoadingWheel.name = 'v-loading-wheel';
ButtonImage.name = 'ButtonImage';
VBurger.name = 'VBurger';
VModal.name = 'VModal';
VCheckbox.name = 'VCheckbox';
VRadio.name = 'VRadio';
VSelect.name = 'VSelect';
VSelectDistrict.name = 'VSelectDistrict';


declare module '@vue/runtime-core' {
   export interface GlobalComponents {
      VButton: typeof VButton;
      VBurger: typeof VBurger;
      VLoadingWheel: typeof VLoadingWheel;
      VModal: typeof VModal;
      VInputFind: typeof VInputFind;
      VCheckbox: typeof VCheckbox;
      VRadio: typeof VRadio;
      VSelectDistrict: typeof VSelectDistrict;
      VInput: typeof VInput;
      VSelect: typeof VSelect;
      ButtonImage: typeof ButtonImage;
   }
}

export default [
   VButton, VBurger, VLoadingWheel, VModal,
   VInputFind, VCheckbox, VRadio,
   VSelectDistrict, VInput, VSelect, ButtonImage
];