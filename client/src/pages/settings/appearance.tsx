import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Localize from '../../utilities/localize';
import SessionState from '../../utilities/session-state';
import { Moon, Sun } from 'lucide-react';

interface Props {
  toggleDarkMode: () => void;
}

function AppearanceSettings({ toggleDarkMode }: Props) {
  // Grab localize engine and dark mode
  const localize = Localize.getInstance().localize();
  const isDarkMode = SessionState.getInstance().getDarkMode();
  return (
    <>
      <p className="text-gray-600 dark:text-gray-300">
        {localize.settingsPage.appearance.colorScheme.label}
      </p>
      <div className="space-y-6"/>

      <Card className="border-2 border-muted">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-indigo-500" />
              ) : (
                <Sun className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <Label htmlFor="dark-mode" className="font-medium">
                  {isDarkMode 
                    ? localize.settingsPage.appearance.colorScheme.darkMode || "Dark Mode" 
                    : localize.settingsPage.appearance.colorScheme.lightMode || "Light Mode"}
                </Label>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AppearanceSettings;
