import { Home, Settings } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Localize from '@/utilities/localize';

interface ManageNavProps {
  setRoomHome: () => void;
  setRoomSettings: () => void;
}

export function ManageNav({ setRoomHome, setRoomSettings }: ManageNavProps) {
  const localize = Localize.getInstance().localize();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip={localize.roomPage.categories.home}
            onClick={setRoomHome}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <Home />
              <span>{localize.roomPage.categories.home}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip={localize.roomPage.categories.settings}
            onClick={setRoomSettings}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <Settings />
              <span>{localize.roomPage.categories.settings}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
