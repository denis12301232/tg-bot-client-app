import AccountSetAvatar from './AccountSetAvatar.vue'
import AccountSetEmail from './AccountSetEmail.vue'
import AccountSetName from './AccountSetName.vue'
import AccountSetPassword from './AccountSetPassword.vue'


export default class Account {
   static readonly SetAvatar = AccountSetAvatar;
   static readonly SetEmail = AccountSetEmail;
   static readonly SetName = AccountSetName;
   static readonly SetPassword = AccountSetPassword;
}