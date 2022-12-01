import CButton from '@/components/UI/CButton.vue'
import CBurger from '@/components/UI/CBurger.vue'
import LoadingWheel from '@/components/UI/LoadingWheel.vue'
import CInputFind from '@/components/UI/CInputFind.vue'
import CCheckbox from '@/components/UI/CCheckbox.vue'
import CRadio from '@/components/UI/CRadio.vue'
import CInput from '@/components/UI/CInput.vue'
import CSelect from '@/components/UI/CSelect.vue'
import ButtonImage from '@/components/UI/ButtonImage.vue'
import ModalWindow from '@/components/UI/ModalWindow.vue'

CButton.name = 'CButton';
CBurger.name = 'CBurger';
LoadingWheel.name = 'LoadingWheel';
CInputFind.name = 'CInputFind';
CCheckbox.name = 'CCheckbox';
CRadio.name = 'CRadio';
CInput.name = 'CInput';
CSelect.name = 'CSelect';
ButtonImage.name = 'ButtonImage';
ModalWindow.name = 'ModalWindow';

declare module '@vue/runtime-core' {
   export interface GlobalComponents {
      CButton: typeof CButton;
      CBurger: typeof CBurger;
      LoadingWheel: typeof LoadingWheel;
      ModalWindow: typeof ModalWindow;
      CInputFind: typeof CInputFind;
      CCheckbox: typeof CCheckbox;
      CRadio: typeof CRadio;
      CInput: typeof CInput;
      CSelect: typeof CSelect;
      ButtonImage: typeof ButtonImage;
   }
}

export default [
   CButton, CBurger, LoadingWheel, ModalWindow,
   CInputFind, CCheckbox, CRadio,
   CInput, CSelect, ButtonImage
];