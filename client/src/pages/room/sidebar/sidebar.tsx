import {
  ChevronRight,
  FileText,
  MoreHorizontal,
  Settings,
  LogOut,
  TvMinimalPlay,
  AudioLines,
} from 'lucide-react';
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
import { Types } from 'syncstream-sharedlib';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileItem } from './file-item';

interface RoomSidebarProps {
  roomName: string;
  username: string;
  media: Types.FileData[];
  activeDoc: string | null;
  activeStream: string | null;
  activeVoice: string | null;
  setActiveDoc: (docID: string) => void;
  setActiveStream: (streamID: string) => void;
  setActiveVoice: (voiceID: string) => void;
  updateMedia: (mediaID: string) => void;
  deleteMedia: (mediaID: string) => void;
  refreshMedia: () => void;
}

export function RoomSidebar({
  roomName,
  username,
  media,
  activeDoc,
  activeStream,
  activeVoice,
  setActiveDoc,
  setActiveStream,
  setActiveVoice,
  updateMedia,
  deleteMedia,
  refreshMedia,
}: RoomSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  {roomName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{roomName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="mx-auto w-4/5 flex justify-center" />
      <SidebarContent className="gap-0">
        <SidebarMenu>
          {/* Document Group */}
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
                  {media
                    .filter((d) => d.fileExtension === 'doc')
                    .map((doc) => (
                      <FileItem key={doc.fileId}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={doc.fileId! === activeDoc}
                            onClick={() => setActiveDoc(doc.fileId!)}
                          >
                            <span>{doc.fileName}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </FileItem>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          {/* Stream Group */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild>
                  <a>
                    <TvMinimalPlay />
                    <span>Streams</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </a>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {media
                    .filter((d) => d.fileExtension === 'stream')
                    .map((doc) => (
                      <FileItem key={doc.fileId}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={doc.fileId! === activeStream}
                            onClick={() => setActiveStream(doc.fileId!)}
                          >
                            <span>{doc.fileName}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </FileItem>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          {/* Voice Channel Group */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild>
                  <a>
                    <AudioLines />
                    <span>Voice Channels</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </a>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {media
                    .filter((d) => d.fileExtension === 'voice')
                    .map((doc) => (
                      <FileItem key={doc.fileId}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={doc.fileId! === activeVoice}
                            onClick={() => setActiveVoice(doc.fileId!)}
                          >
                            <span>{doc.fileName}</span>
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
      <SidebarSeparator className="mx-auto w-4/5 flex justify-center" />
      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton asChild>
                  <a>
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <span>{username}</span>
                    <MoreHorizontal className="ml-auto" />
                  </a>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Settings />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut />
                  <span>Leave Room</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
