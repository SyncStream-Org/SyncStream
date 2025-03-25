import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { MediaNav } from '@/pages/room/sidebar/media-nav';
import { NavProjects } from '@/pages/room/sidebar/nav-projects';
import { NavUser } from '@/pages/room/sidebar/nav-user';
import { RoomHeader } from '@/pages/room/sidebar/room-header';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';

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

export function AppSidebar({
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
        <RoomHeader roomName={roomName} />
      </SidebarHeader>
      <SidebarContent>
        <MediaNav
          media={media}
          activeDoc={activeDoc}
          activeStream={activeStream}
          activeVoice={activeVoice}
          setActiveDoc={setActiveDoc}
          setActiveStream={setActiveStream}
          setActiveVoice={setActiveVoice}
          updateMedia={updateMedia}
          deleteMedia={deleteMedia}
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
