import AccountSetName from './AccountSetName.vue';
import AccountSetAvatar from './AccountSetAvatar.vue';
import AccountSetEmail from './AccountSetEmail.vue';
import AccountSetPassword from './AccountSetPassword.vue';

export default class Account {
  static SetName = AccountSetName;
  static SetAvatar = AccountSetAvatar;
  static SetEmail = AccountSetEmail;
  static SetPassword = AccountSetPassword;
}
