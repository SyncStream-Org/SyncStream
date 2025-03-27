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
  activeItem: Types.FileData | null;
  setActive: (item: Types.FileData) => void;
  items: Types.FileData[];
}

interface MediaNavProps {
  media: Types.FileData[];
  roomId: string;
  activeDoc: Types.FileData | null;
  activeStream: Types.FileData | null;
  activeVoice: Types.FileData | null;
  setActiveDoc: (doc: Types.FileData) => void;
  setActiveStream: (stream: Types.FileData) => void;
  setActiveVoice: (voice: Types.FileData) => void;
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
    setMediaItems((prev) => ({
      ...prev,
      docs: {
        ...prev.docs,
        activeItem: activeDoc,
      },
      streams: {
        ...prev.streams,
        activeItem: activeStream,
      },
      voiceChannels: {
        ...prev.voiceChannels,
        activeItem: activeVoice,
      },
    }));
  }, [activeDoc, activeStream, activeVoice]);

  useEffect(() => {
    const docsItems: Types.FileData[] = [];
    const streamsItems: Types.FileData[] = [];
    const voiceItems: Types.FileData[] = [];

    media.forEach((item) => {
      const itemType = item.fileExtension;
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
        items: docsItems,
      },
      streams: {
        ...prev.streams,
        items: streamsItems,
      },
      voiceChannels: {
        ...prev.voiceChannels,
        items: voiceItems,
      },
    }));
  }, [media]);

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
                      <FileItem key={subItem.fileId} roomId={roomId} mediaObject={subItem}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              subItem.fileId! === item.activeItem?.fileId!
                            }
                            onClick={() => item.setActive(subItem)}
                          >
                            <span>{subItem.fileName}</span>
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
