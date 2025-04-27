import { Types } from 'syncstream-sharedlib';
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

interface RoomSidebarProps {
  room: Types.RoomData | null;
  username: string;
  media: Types.MediaData[];
  activeDoc: Types.MediaData | null;
  activeStream: Types.MediaData | null;
  activeVoice: Types.MediaData | null;
  setActiveDoc: (doc: Types.MediaData) => void;
  setActiveStream: (stream: Types.MediaData) => void;
  setActiveVoice: (voice: Types.MediaData) => void;
  goToHome: () => void;
  goToSettings: () => void;
  setRoomHome: () => void;
  setRoomSettings: () => void;
}

export function AppSidebar({
  room,
  username,
  media,
  activeDoc,
  activeStream,
  activeVoice,
  setActiveDoc,
  setActiveStream,
  setActiveVoice,
  goToHome,
  goToSettings,
  setRoomHome,
  setRoomSettings,
}: RoomSidebarProps) {
  return room ? (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <RoomHeader roomName={room.roomName} />
      </SidebarHeader>
      <SidebarContent>
        <ManageNav
          setRoomHome={setRoomHome}
          setRoomSettings={setRoomSettings}
        />
        <MediaNav
          media={media}
          roomId={room.roomID!}
          activeDoc={activeDoc}
          activeStream={activeStream}
          activeVoice={activeVoice}
          setActiveDoc={setActiveDoc}
          setActiveStream={setActiveStream}
          setActiveVoice={setActiveVoice}
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
  ) : null;
}
