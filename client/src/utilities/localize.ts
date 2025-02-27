// The localization engine. Loads localized text from disk for use at runtime

import englishDict from '../../assets/languages/english.json';
import gibberishDict from '../../assets/languages/gibberish.json';

// Export languages available
export type Language = 'english' | 'gibberish';

// Export available ids for strings
export type LanguageDict = {
  launchPage: {
    title: string;
    usernameLabel: string;
    passwordLabel: string;
    serverURLLabel: string;
    serverURLButtonText: string;
    submitButtonText: string;
    messageBoxErrorTitle: string;
    messageBoxInvalidServer: string;
    messageBoxInvalidAuth: string;
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
