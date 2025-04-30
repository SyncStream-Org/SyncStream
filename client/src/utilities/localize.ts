// The localization engine. Loads localized text from disk for use at runtime

import englishDict from '../../assets/languages/english.json';
import gibberishDict from '../../assets/languages/gibberish.json';

// Export languages available
export const LanguageArray = ['english', 'gibberish'] as const;
export type Language = (typeof LanguageArray)[number];

// Export available ids for strings
export type SettingsPageCategories =
  | 'general'
  | 'appearance'
  | 'language'
  | 'userManagement';
export type LanguageDict = {
  launchPage: {
    title: string;
    form: {
      username: string;
      password: string;
      serverURL: string;
      serverURLButton: string;
      submit: string;
    };
    messageBox: {
      errorTitle: string;
      invalidServer: string;
      invalidAuth: string;
      incompatibleClient: string;
    };
  };
  settingsPage: {
    title: string;
    backButtonText: string;
    categories: {
      [key in SettingsPageCategories]: {
        title: string;
        shortTitle: string;
      };
    };
    general: {
      profile: {
        title: string;
        username: string;
        displayName: string;
        email: string;
      };
      changeProfile: {
        title: string;
        displayName: string;
        email: string;
        password: string;
        submit: string;
        displayNamePlaceholder: string;
        emailPlaceholder: string;
        passwordPlaceholder: string;
      };
      dangerZone: {
        title: string;
        logOut: string;
      };
      messageBox: {
        errorTitle: string;
        updateError: string;
        successTitle: string;
        updateSuccess: string;
      };
    };
    language: {
      languageChange: string;
    };
    appearance: {
      colorScheme: {
        label: string;
        lightMode: string;
        darkMode: string;
      };
    };
    userManagement: {
      title: string;
      userCreationTitle: string;
      adminManagement: {
        searchPlaceholder: string;
        deleteSelectedButton: string;
        loading: string;
        noUsers: string;
        member: string;
        notMember: string;
        admin: string;
        notAdmin: string;
      };
      users: {
        title: string;
        noUsers: string;
        username: string;
        displayName: string;
        email: string;
        admin: string;
      };
      createUser: {
        title: string;
        username: string;
        email: string;
        password: string;
        displayName: string;
        admin: string;
        submit: string;
        displayNamePlaceholder: string;
        emailPlaceholder: string;
        usernamePlaceholder: string;
      };
      messageBox: {
        successTitle: string;
        errorTitle: string;
        userGetError: string;
        userDeleteError: string;
        userCreateError: string;
        userCreateAutogenPass: string;
        removeUserError: string;
        removeUserSuccess: {
          Part1: string;
          Part2: string;
        };
      };
    };
  };
  homePage: {
    title: string;
    settingsButton: string;
    adminPanelButton: string;
    avatarTooltip: string;
    roomCard: {
      owner: string;
      userCount: string;
    };
    createRoom: {
      button: string;
      popupTitle: string;
      inputLabel: string;
      submit: string;
    };
    messageBox: {
      errorTitle: string;
      roomFetchError: string;
      roomPresenceError: string;
      roomCreationError1: string;
      roomCreationError2: string;
      joinRoomError: string;
      roomInviteAcceptError1: string;
      roomInviteAcceptError2: string;
      roomInviteDeclineError1: string;
      roomInviteDeclineError2: string;
    };
  };
};

// Map language ids to language maps
const languageMap: { [id in Language]: LanguageDict } = {
  english: englishDict as LanguageDict,
  gibberish: gibberishDict as LanguageDict,
};

export default class Localize {
  private static instance: Localize = new Localize();

  // Change this to another language to change the localization
  public currentLanguage: Language = 'english';

  public static getInstance(): Localize {
    return this.instance;
  }

  // Grab correct language dict
  public localize(this: Localize): LanguageDict {
    return languageMap[this.currentLanguage];
  }
}
