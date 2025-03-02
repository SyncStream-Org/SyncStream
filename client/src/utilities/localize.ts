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
      languageChange: string;
    };
    appearance: {
      colorScheme: {
        label: string;
        lightMode: string;
        darkMode: string;
      };
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
