import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Localize, { Language, LanguageArray } from '../../utilities/localize';

interface Props {
  forceUpdate: () => void;
}

function LanguageSettings({ forceUpdate }: Props) {
  // Grab localize engine
  const localize = Localize.getInstance().localize();

  return (
    <div className="flex items-center gap-4">
      <Label
        htmlFor="language-select"
        className="whitespace-nowrap text-gray-600 dark:text-gray-300"
      >
        {localize.settingsPage.language.languageChange || 'Display Language:'}
      </Label>

      <Select
        onValueChange={(language) => {
          Localize.getInstance().currentLanguage = language as Language;
          forceUpdate();
        }}
      >
        <SelectTrigger id="language-select" className="w-[180px]">
          <SelectValue placeholder={Localize.getInstance().currentLanguage} />
        </SelectTrigger>
        <SelectContent>
          {LanguageArray.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default LanguageSettings;
