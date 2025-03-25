import { ChevronRight, FileText, MoreHorizontal } from 'lucide-react';
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { FileItem } from './file-item';
import { Types } from 'syncstream-sharedlib';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface RoomSidebarProps {
  username: string;
  docs: Types.FileData[];
  activeDoc: string | null;
  setActiveDoc: (docID: string) => void;
  updateDoc: (docID: string) => void;
  deleteDoc: (docID: string) => void;
  refreshDoc: () => void;
}

export function RoomSidebar(
  { username, docs, activeDoc, setActiveDoc, updateDoc, deleteDoc, refreshDoc }: RoomSidebarProps,
) {
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h1 className="text-lg font-bold">My Application</h1>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent className='gap-0'>
        <SidebarMenu>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild>
                  <a>
                    <FileText />
                    <span>Documents</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </a>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {docs.map((doc) => (
                    <FileItem key={doc.fileId}>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={doc.fileId! === activeDoc}>
                          <a
                            onClick={() => setActiveDoc(doc.fileId!)}
                          >
                            {doc.fileName}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </FileItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                    <span>{username}</span>
                    <MoreHorizontal className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
