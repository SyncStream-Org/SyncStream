import { MediaNav } from '@/pages/room/sidebar/media-nav';
import { ManageNav } from '@/pages/room/sidebar/manage-nav';
import { UserNav } from '@/pages/room/sidebar/user-nav';
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
  goToHome: () => void;
  goToSettings: () => void;
  setRoomHome: () => void;
  setRoomSettings: () => void;
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
  goToHome,
  goToSettings,
  setRoomHome,
  setRoomSettings,
}: RoomSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <RoomHeader roomName={roomName} />
      </SidebarHeader>
      <SidebarContent>
        <ManageNav
          setRoomHome={setRoomHome}
          setRoomSettings={setRoomSettings}
        />
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
      </SidebarContent>
      <SidebarFooter>
        <UserNav 
          username={username}
          goToHome={goToHome}
          goToSettings={goToSettings}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
