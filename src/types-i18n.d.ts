// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DefineLocaleMessage, DefineDateTimeFormat, DefineNumberFormat, Locale } from 'vue-i18n';

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    home: {
      tabs: {
        form: string;
        list: string;
        search: string;
      };
      form: {
        title: string;
        sections: {
          fio: string;
          phone: string;
          birth: string;
          address: string;
          peopleCount: string;
          peopleFio: string;
          invalids: string;
          kids: string;
          kidsAge: string;
          food: string;
          water: string;
          medecines: string;
          medicinesInfo: string;
          hygiene: string;
          hygieneInfo: string;
          pampers: string;
          pampersInfo: string;
          extraInfo: string;
          personalDataAgreement: string;
          photoAgreement: string;
        };
        fields: {
          sector: {
            value: string;
            placeholder: string;
          };
          surname: {
            placeholder: string;
            errors: {
              required: string;
            };
            value: string;
          };
          name: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
            };
          };
          patronymic: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
            };
          };
          phone: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
              isPhone: string;
            };
          };
          birth: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
              isYYYYMMDDD: string;
            };
          };
          district: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
            };
          };
          street: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
              district: string;
            };
          };
          house: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
            };
          };
          flat: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
              isNumber: string;
            };
          };
          peopleCount: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
              isNumber: string;
              minMax: string;
            };
          };
          peopleFio: {
            placeholder: string;
            value: string;
            errors: {
              required: string;
            };
          };
          invalids: {
            value: string;
          };
          kids: {
            value: string;
          };
          kidsAge: {
            value: string;
          };
          food: {
            value: string;
          };
          water: {
            value: string;
          };
          medicines: {
            value: string;
          };
          medicinesInfo: {
            placeholder: string;
            value: string;
          };
          hygiene: {
            value: string;
          };
          hygieneInfo: {
            placeholder: string;
            value: string;
          };
          pampers: {
            value: string;
          };
          pampersInfo: {
            placeholder: string;
            value: string;
          };
          extraInfo: {
            placeholder: string;
            value: string;
          };
          personalDataAgreement: {
            value: string;
            checkbox: string;
          };
          photoAgreement: {
            value: string;
            checkbox: string;
          };
        };
        checkboxes: {
          yesNo: string[];
          kidsAge: string[];
        };
        buttons: {
          submit: string;
        };
      };
      menu: {
        left: {
          title: string;
          gallery: string;
          chat: string;
          tasks: string;
          meets: string;
          stats: string;
        };
        right: {
          account: string;
          tools: string;
          logout: string;
        };
      };
      messages: {
        save: string;
      };
    };
    list: {
      table: {
        title: string;
      };
      hints: {
        columns: string;
        delete: string;
        filter: string;
        import: string;
        export: string;
      };
      import: {
        title: string;
        messages: {
          help: string;
          success: string;
          uploaded: string;
          errors: string;
        };
      };
      export: {
        title: string;
        type: {
          placeholder: string;
        };
        buttons: {
          save: string;
        };
        messages: {
          link: string;
        };
      };
      filter: {
        title: string;
        form: {
          fields: {
            year: {
              min: string;
              max: string;
            };
            district: {
              placeholder: string;
            };
            street: {
              placeholder: string;
            };
            sector: {
              placeholder: string;
            };
          };
          buttons: {
            set: string;
          };
          checkboxes: string[];
        };
        messages: {
          district: string;
        };
      };
    };
    info: {
      title: string;
      search: {
        placeholder: string;
        errors: {
          notFound: string;
        };
      };
      hints: {
        info: string;
        edit: string;
      };
      table: {
        title: string;
      };
    };
    infoById: {
      layout: {
        title: string;
      };
      title: string;
      form: {
        title: string;
      };
      table: {
        title: string;
      };
    };
    account: {
      title: string;
      form: {
        fields: {
          name: {
            placeholder: string;
            errors: {
              required: string;
              lengthInterval: string;
            };
          };
          email: {
            placeholder: string;
            errors: {
              required: string;
              isEmail: string;
            };
          };
          oldPassword: {
            placeholder: string;
            errors: {
              required: string;
            };
          };
          newPassword: {
            placeholder: string;
            errors: {
              required: string;
              lengthInterval: string;
            };
          };
        };
        buttons: {
          avatar: string;
          password: string;
        };
      };
      messages: {
        avatar: string;
        email: string;
        name: string;
        password: string;
      };
    };
    tools: {
      layout: {
        title: string;
      };
      tabs: {
        roles: string;
        google: string;
      };
      roles: {
        title: string;
        table: {
          search: {
            placeholder: string;
          };
          columns: {
            name: string;
            login: string;
            role: string;
          };
          checkboxes: {
            user: string;
            admin: string;
          };
        };
        messages: {
          update: string;
        };
      };
      google: {
        title: string;
        form: {
          fields: {
            serviceAccountUser: {
              placeholder: string;
            };
            serviceAccountPrivateKey: {
              placeholder: string;
            };
            sheetId: {
              placeholder: string;
            };
            folderId: {
              placeholder: string;
            };
          };
          buttons: {
            save: string;
          };
        };
        messages: {
          success: string;
          error: string;
        };
      };
    };
    stats: {
      layout: {
        title: string;
      };
      form: {
        fields: {
          interval: {
            placeholder: string;
            options: string[];
          };
          period: {
            placeholder: string;
          };
        };
      };
    };
    gallery: {
      layout: {
        title: string;
      };
      title: string;
      hints: {
        upload: string;
        delete: string;
      };
      errors: {
        none: string;
      };
      messages: {
        about: string;
      };
    };
    tasks: {
      layout: {
        title: string;
        tabs: {
          list: string;
          create: string;
        };
      };
      list: {
        title: string;
        table: {
          filter: {
            placeholder: string;
            options: string[];
          };
          columns: {
            title: string;
            tags: string;
            status: string;
            date: string;
            actions: string;
          };
        };
        hints: {
          complete: string;
          cancel: string;
          take: string;
          about: string;
        }
      };
      create: {
        first: {
          form: {
            title: string;
            fields: {
              title: {
                placeholder: string;
                errors: {
                  required: string;
                };
              };
              tags: {
                placeholder: string;
                errors: {
                  lengthInterval: string;
                };
              };
            };
            buttons: {
              next: string;
            };
          };
        };
        second: {
          form: {
            title: string;
            subtitle: string;
            fields: {
              title: {
                placeholder: string;
                errors: {
                  required: string;
                };
              };
              about: {
                placeholder: string;
                errors: {
                  required: string;
                };
              };
            };
            buttons: {
              back: string;
              create: string;
              add: string;
            };
          };
          table: {
            title: string;
            columns: {
              title: string;
              description: string;
            };
          };
        };
        hinst: {
          delete: string;
        };
      };
      statuses: {
        completed: string;
        canceled: string;
        performed: string;
        untaken: string;
      };
    };
    taskId: {
      layout: {
        title: string;
      };
      tabs: {
        task: string;
        subtasks: string;
      };
      task: {
        card: {
          title: string;
          tags: string;
          status: string;
          date: string;
          takenBy: string;
        };
      };
      subtasks: {
        table: {
          title: string;
          columns: {
            title: string;
            description: string;
            status: string;
            extraInfo: string;
          };
        };
        move: {
          title: string;
        };
      };
      messages: {
        untaken: string;
      };
      hints: {
        download: string;
        move: string;
        delete: string;
      };
    };
    meets: {
      layout: {
        title: string;
      };
      create: {
        title: string;
        form: {
          fields: {
            title: {
              placeholder: string;
            };
          };
          buttons: {
            create: string;
          };
        };
      };
      join: {
        title: string;
        form: {
          fields: {
            meetId: {
              placeholder: string;
            };
          };
          buttons: {
            join: string;
          };
        };
      };
      hints: {
        noMic: string;
        noMeet: string;
      }
    };
    meetId: {
      layout: {
        title: string;
      };
      hints: {
        mic: string;
        camera: string;
        share: string;
        chat: string;
        leave: string;
        people: string;
        info: string;
        copy: string;
      };
      messages: {
        screen: string;
      };
      people: {
        title: string;
      };
      info: {
        title: string;
        labels: {
          id: string;
        };
      };
      chat: {
        title: string;
        send: {
          placeholder: string;
        };
      };
    };
    chat: {
      menu: {
        left: {
          title: string;
          home: string;
          account: string;
          group: string;
        };
        group: {
          info: string;
          tools: string;
          leave: string;
        };
      };
      messages: {
        none: string;
        select: string;
        people: string;
        typing: string;
        me: string;
        audio: string;
        image: string;
        deleteMessage: string;
        copyMessage: string;
      };
      search: {
        placeholder: string;
        errors: {
          none: string;
        };
      };
      hints: {
        add: string;
      };
      send: {
        placeholder: string;
        recording: string;
        voice: string;
      };
      addUser: {
        title: string;
        form: {
          fields: {
            name: {
              placeholder: string;
              errors: {
                none: string;
              };
            };
          };
          buttons: {
            add: string;
          };
        };
        messages: {
          added: string;
          error: string;
        };
      };
      aboutGroup: {
        title: string;
        labels: {
          about: string;
          people: string;
        };
        search: {
          placeholder: string;
          errors: {
            none: string;
          };
        };
        messages: {
          people: string;
        };
      };
      groupSettings: {
        form: {
          fields: {
            title: {
              placeholder: string;
            };
            about: {
              placeholder: string;
            };
          };
          buttons: {
            submit: string;
            roles: string;
          };
        };
        messages: {
          updated: string;
          failed: string;
        };
        table: {
          title: string;
          checkboxes: string[];
        };
      };
      createGroup: {
        title: string;
        first: {
          form: {
            title: string;
            fields: {
              title: {
                placeholder: string;
              };
              about: {
                placeholder: string;
              };
            };
            buttons: {
              next: string;
            };
          };
        };
        second: {
          form: {
            title: string;
            subtitle: string;
            buttons: {
              back: string;
              create: string;
            };
          };
        };
      };
    };
    login: {
      form: {
        title: string;
        fields: {
          loginOrEmail: {
            placeholder: string;
            errors: {
              required: string;
              incorrect: string;
            };
          };
          password: {
            placeholder: string;
            errors: {
              required: string;
              incorrect: string;
            };
          };
        };
        buttons: {
          login: string;
          registration: string;
          restore: string;
        };
        messages: {
          notRegister: string;
          restore: string;
        };
      };
    };
    registration: {
      form: {
        title: string;
        fields: {
          name: {
            placeholder: string;
            errors: {
              required: string;
              noManySpaces: string;
            };
          };
          login: {
            placeholder: string;
            errors: {
              required: string;
              isLatinOrUnderscore: string;
              alreadyTaken: string;
            };
          };
          email: {
            placeholder: string;
            errors: {
              required: string;
              isEmail: string;
              alreadyTaken: string;
            };
          };
          password: {
            placeholder: string;
            errors: {
              required: string;
              lengthInterval: string;
            };
          };
        };
        buttons: {
          registration: string;
          login: string;
        };
        messages: {
          alreadyReg: string;
        };
      };
    };
    restore: {
      messages: {
        link: string;
      };
      form: {
        title: string;
        fields: {
          email: {
            placeholder: string;
            errors: {
              required: string;
              isEmail: string;
            };
          };
        };
        buttons: {
          restore: string;
        };
      };
      link: {
        form: {
          title: string;
          fields: {
            password: {
              placeholder: string;
              errors: {
                required: string;
                lengthInterval: string;
              };
            };
          };
          buttons: {
            change: string;
          };
        };
      };
    };
    error: {
      buttons: {
        home: string;
      };
    };
    extra: {
      emoji: {
        smiles: string;
        nature: string;
        objects: string;
        places: string;
        symbols: string;
      };
      districts: string[];
      streets: string[][];
      table: {
        notFound: string;
        noData: string;
        show: string;
        of: string;
        loading: string;
        selected: string;
      };
      calendar: {
        days: string[];
        daysShort: string[];
        months: string[];
        monthsShort: string[];
        firstDayOfWeek: number;
        format24h: boolean;
        pluralDay: string;
        close: string;
      };
    };
  }

  export interface DefineDateTimeFormat {
    time: {
      hour: 'numeric';
      minute: 'numeric';
    };
    short: {
      hour: 'numeric';
      minute: 'numeric';
      second: 'numeric';
      timeZoneName: 'short';
      timezone: string;
    };
    MMDD: {
      month: 'numeric';
      day: 'numeric';
    };
    YYYYMMDD: {
      year: 'numeric';
      month: 'numeric';
      day: 'numeric';
    };
  }

  export interface DefineNumberFormat {
    currency: {
      style: 'currency';
      currencyDisplay: 'symbol';
      currency: string;
    };
  }
}
