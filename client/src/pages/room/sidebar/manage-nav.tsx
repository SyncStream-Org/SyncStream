import { Home, Settings } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface ManageNavProps {
  setRoomHome: () => void;
  setRoomSettings: () => void;
}

export function ManageNav({ setRoomHome, setRoomSettings }: ManageNavProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Room Homepage"
            onClick={setRoomHome}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <Home />
              <span>Home</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Room Settings"
            onClick={setRoomSettings}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <Settings />
              <span>Settings</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
