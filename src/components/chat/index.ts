import ChatPanelLeft from './ChatPanelLeft.vue';
import ChatListSearch from './ChatListSearch.vue';
import ChatList from './ChatList.vue';
import ChatPanelRight from './ChatPanelRight.vue';
import ChatDialogHeader from './ChatDialogHeader.vue';
import ChatDialogMessages from './ChatDialogMessages.vue';
import ChatInput from './ChatInput.vue';
import ChatMessageImage from './ChatMessageImage.vue';
import ChatMessageVoice from './ChatMessageVoice.vue';
import ChatModalImage from './ChatModalImage.vue';
import ChatGroupAddUser from './ChatGroupAddUser.vue';
import ChatGroupInfo from './ChatGroupInfo.vue';
import ChatGroupCreate from './ChatGroupCreate.vue';
import ChatGroupSettings from './ChatGroupSettings.vue';

export default class Chat {
  static RightPanel = ChatPanelRight;
  static LeftPanel = ChatPanelLeft;
  static ListSearch = ChatListSearch;
  static List = ChatList;
  static DialogHeader = ChatDialogHeader;
  static DialogMessages = ChatDialogMessages;
  static Input = ChatInput;
  static MessageImage = ChatMessageImage;
  static MessageVoice = ChatMessageVoice;
  static ModalImage = ChatModalImage;
  static GroupAddUser = ChatGroupAddUser;
  static GroupInfo = ChatGroupInfo;
  static GroupCreate = ChatGroupCreate;
  static GroupSettings = ChatGroupSettings;
}
