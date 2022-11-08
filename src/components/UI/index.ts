import VButton from '@/components/UI/VButton.vue'
import VBurger from '@/components/UI/VBurger.vue'
import LoadingWheel from '@/components/UI/LoadingWheel.vue'
import VInputFind from '@/components/UI/VInputFind.vue'
import VCheckbox from '@/components/UI/VCheckbox.vue'
import VRadio from '@/components/UI/VRadio.vue'
import VSelectDistrict from '@/components/UI/VSelectDistrict.vue'
import VInput from '@/components/UI/VInput.vue'
import VSelect from '@/components/UI/VSelect.vue'
import ButtonImage from '@/components/UI/ButtonImage.vue'
import ModalWindow from '@/components/UI/ModalWindow.vue'

VButton.name = 'VButton';
VBurger.name = 'VBurger';
LoadingWheel.name = 'LoadingWheel';
VInputFind.name = 'VInputFind';
VCheckbox.name = 'VCheckbox';
VRadio.name = 'VRadio';
VSelectDistrict.name = 'VSelectDistrict';
VInput.name = 'VInput';
VSelect.name = 'VSelect';
ButtonImage.name = 'ButtonImage';
ModalWindow.name = 'ModalWindow';

declare module '@vue/runtime-core' {
   export interface GlobalComponents {
      VButton: typeof VButton;
      VBurger: typeof VBurger;
      LoadingWheel: typeof LoadingWheel;
      ModalWindow: typeof ModalWindow;
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
   VButton, VBurger, LoadingWheel, ModalWindow,
   VInputFind, VCheckbox, VRadio,
   VSelectDistrict, VInput, VSelect, ButtonImage
];