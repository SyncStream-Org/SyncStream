import { Calendar, Home, Inbox, Plus, Search, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { FileItem } from './file-item';

export function RoomSidebar() {
  // make 100 docs
  const docs = Array.from({ length: 100 }, (_, i) => i + 1);
  return (
    <Sidebar collapsible="none">
      <SidebarHeader>
        <h1 className="text-lg font-bold">My Application</h1>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {docs.map((doc) => (
                <FileItem key={doc}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <span>Document{doc}.txt</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </FileItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <h1 className="text-lg font-bold">My Application</h1>
      </SidebarFooter>
    </Sidebar>
  );
}
