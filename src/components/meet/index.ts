import MeetChat from '~/meet/MeetChat.vue';
import MeetInfo from '~/meet/MeetInfo.vue';
import MeetUserList from '~/meet/MeetUserList.vue';

export default class Meet {
   static readonly Chat = MeetChat;
   static readonly Info = MeetInfo;
   static readonly UserList = MeetUserList;
}