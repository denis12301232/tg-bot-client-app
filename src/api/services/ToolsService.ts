import { $api } from '@/api';

export default class ToolsService {
  static setGoogleServiceAccountSettings(settings: {
    serviceUser: string;
    servicePrivateKey: string;
    sheetId: string;
    folderId: string;
  }) {
    return $api.post('tools/google/service', { json: settings });
  }

  static fetchLocale(locale: string) {
    return fetch(`/locales/${locale}.json`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong!');
      })
      .catch((e) => console.error(e));
  }
}
