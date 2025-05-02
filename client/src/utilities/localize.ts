// The localization engine. Loads localized text from disk for use at runtime

import englishDict from '../../assets/languages/english.json';
import frenchDict from '../../assets/languages/french.json';
import italianDict from '../../assets/languages/italian.json';
import japaneseDict from '../../assets/languages/japanese.json';
import koreanDict from '../../assets/languages/korean.json';
import spanishDict from '../../assets/languages/spanish.json';

// Export languages available
export const LanguageArray = [
  'English',
  'Française',
  'Italiana',
  '日本語',
  '한국어',
  'Español',
] as const;
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
  roomPage: {
    leaveRoom: string;
    filter: string;
    sort: string;
    search: string;
    noMedia: string;
    type: string;
    name: string;
    noItems: string;
    activeUsers: string;
    fileItem: {
      rename: string;
      delete: string;
    };
    voiceChannelCard: {
      user: string;
      users: string;
      you: string;
    };
    streamViewer: {
      leave: string;
      stop: string;
    };
    streamDialog: {
      title: string;
      sourceSelectPlaceholder: string;
      sources: string;
    };
    createMedia: {
      button: string;
      title: string;
      name: string;
      type: string;
      submit: string;
      typePlaceholder: string;
    };
    categories: {
      media: string;
      home: string;
      settings: string;
      documents: string;
      streams: string;
      voiceChannels: string;
      document: string;
      stream: string;
      voiceChannel: string;
    };
    messageBox: {
      errorTitle: string;
      successTitle: string;
      inviteSuccess: {
        Part1: string;
        Part2: string;
      };
      removedSuccess: {
        Part1: string;
        Part2: string;
      };
      inviteRemoveError: {
        Part1: string;
        Part2: string;
        invite: string;
        remove: string;
      };
      userFetchError1: string;
      userFetchError2: string;
      roomDeleteError: string;
      roomLeaveError: string;
      roomUpdateError: string;
    };
    roomSettings: {
      updateRoom: {
        title: string;
        newName: string;
        newOwner: string;
        submit: string;
      };
      userManagment: {
        title: string;
        invite: string;
        remove: string;
        searchUsersPlaceholder: string;
        searchMembersPlaceholder: string;
        inviteSelected: string;
        removeSelected: string;
      };
      leave: string;
      leaveCheck: {
        Part1: string;
        Part2: string;
      };
      delete: string;
      deleteCheck: {
        Part1: string;
        Part2: string;
      };
      audioInputLong: string;
      audioInputShort: string;
    };
  };
};

// Map language ids to language maps
const languageMap: { [id in Language]: LanguageDict } = {
  English: englishDict as LanguageDict,
  Française: frenchDict as LanguageDict,
  Italiana: italianDict as LanguageDict,
  日本語: japaneseDict as LanguageDict,
  한국어: koreanDict as LanguageDict,
  Español: spanishDict as LanguageDict,
};

export default class Localize {
  private static instance: Localize = new Localize();

  // Change this to another language to change the localization
  public currentLanguage: Language = 'English';

  public static getInstance(): Localize {
    return this.instance;
  }

  // Grab correct language dict
  public localize(this: Localize): LanguageDict {
    return languageMap[this.currentLanguage];
  }
}
