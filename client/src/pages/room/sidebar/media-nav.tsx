import {
  ChevronRight,
  FileText,
  TvMinimalPlay,
  AudioLines,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';
import { useEffect, useState } from 'react';
import { FileItem } from '../file-item/file-item';

interface MediaCategory {
  title: string;
  icon: any;
  activeItem: Types.MediaData | null;
  setActive: (item: Types.MediaData) => void;
  items: Types.MediaData[];
}

interface MediaNavProps {
  media: Types.MediaData[];
  roomId: string;
  activeDoc: Types.MediaData | null;
  activeStream: Types.MediaData | null;
  activeVoice: Types.MediaData | null;
  setActiveDoc: (doc: Types.MediaData) => void;
  setActiveStream: (stream: Types.MediaData) => void;
  setActiveVoice: (voice: Types.MediaData) => void;
}

export function MediaNav({
  media,
  roomId,
  activeDoc,
  activeStream,
  activeVoice,
  setActiveDoc,
  setActiveStream,
  setActiveVoice,
}: MediaNavProps) {
  // Define mediaItems as state inside the component
  const [mediaItems, setMediaItems] = useState<Record<string, MediaCategory>>({
    docs: {
      title: 'Documents',
      icon: FileText,
      activeItem: null,
      setActive: setActiveDoc,
      items: [],
    },
    streams: {
      title: 'Streams',
      icon: TvMinimalPlay,
      activeItem: null,
      setActive: setActiveStream,
      items: [],
    },
    voiceChannels: {
      title: 'Voice Channels',
      icon: AudioLines,
      activeItem: null,
      setActive: setActiveVoice,
      items: [],
    },
  });

  // Update active items when props change
  useEffect(() => {
    const docsItems: Types.MediaData[] = [];
    const streamsItems: Types.MediaData[] = [];
    const voiceItems: Types.MediaData[] = [];

    media.forEach((item) => {
      const itemType = item.mediaType;
      if (itemType === 'doc') {
        docsItems.push(item);
      } else if (itemType === 'stream') {
        streamsItems.push(item);
      } else if (itemType === 'voice') {
        voiceItems.push(item);
      }
    });

    setMediaItems((prev) => ({
      ...prev,
      docs: {
        ...prev.docs,
        activeItem: activeDoc,
        items: docsItems,
      },
      streams: {
        ...prev.streams,
        activeItem: activeStream,
        items: streamsItems,
      },
      voiceChannels: {
        ...prev.voiceChannels,
        activeItem: activeVoice,
        items: voiceItems,
      },
    }));
  }, [media, activeDoc, activeStream, activeVoice]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Media</SidebarGroupLabel>
      <SidebarMenu>
        {Object.values(mediaItems).map((item) => (
          <Collapsible key={item.title} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.length > 0 ? (
                    item.items.map((subItem) => (
                      <FileItem
                        key={subItem.mediaID}
                        roomID={roomId}
                        mediaObject={subItem}
                      >
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              subItem.mediaID! === item.activeItem?.mediaID!
                            }
                            onClick={() => item.setActive(subItem)}
                          >
                            <span>{subItem.mediaName}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </FileItem>
                    ))
                  ) : (
                    <SidebarMenuSubItem>
                      <span className="text-gray-500">No items found</span>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
