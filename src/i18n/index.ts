export const datetimeFormats = {
  ru: {
    time: {
      hour: 'numeric',
      minute: 'numeric',
    },
    short: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
      timezone: 'string',
    },
    MMDD: {
      month: 'numeric',
      day: 'numeric',
    },
    YYYYMMDD: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  },
  uk: {
    time: {
      hour: 'numeric',
      minute: 'numeric',
    },
    short: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
      timezone: 'string',
    },
    MMDD: {
      month: 'numeric',
      day: 'numeric',
    },
    YYYYMMDD: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  },
  en: {
    time: {
      hour: 'numeric',
      minute: 'numeric',
    },
    short: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
      timezone: 'string',
    },
    MMDD: {
      month: 'numeric',
      day: 'numeric',
    },
    YYYYMMDD: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  },
};

export class Pluralization {
  static slavic(choice: number, choicesLength: number) {
    if (choice === 0) {
      return 0;
    }

    const teen = choice > 10 && choice < 20;
    const endsWithOne = choice % 10 === 1;

    if (choicesLength < 4) {
      return !teen && endsWithOne ? 1 : 2;
    }
    if (!teen && endsWithOne) {
      return 1;
    }
    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
      return 2;
    }

    return choicesLength < 4 ? 2 : 3;
  }
}
