import { FileText, Monitor, Mic, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Types } from 'syncstream-sharedlib';
import { FileItem } from '../file-item/file-item';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocCardProps {
  roomID: string;
  item: Types.MediaData;
  setActiveDoc: (doc: Types.MediaData | null) => void;
  setActiveStream: (stream: Types.MediaData | null) => void;
  setActiveVoice: (voice: Types.MediaData | null) => void;
  activeUsers?: string[];
}

export function DocCard({
  roomID,
  item,
  setActiveDoc,
  setActiveStream,
  setActiveVoice,
  activeUsers = [],
}: DocCardProps) {
  const handleCardClick = () => {
    if (item.mediaType === 'doc') {
      setActiveDoc(item);
    } else if (item.mediaType === 'stream') {
      setActiveStream(item);
    } else if (item.mediaType === 'voice') {
      setActiveVoice(item);
    }
  };

  const getMediaIcon = () => {
    switch (item.mediaType) {
      case 'doc':
        return <FileText className="h-10 w-10 mb-2 text-blue-500" />;
      case 'stream':
        return <Monitor className="h-10 w-10 mb-2 text-purple-500" />;
      case 'voice':
        return <Mic className="h-10 w-10 mb-2 text-green-500" />;
      default:
        return <FileText className="h-10 w-10 mb-2 text-gray-500" />;
    }
  };

  return (
    <FileItem roomID={roomID} mediaObject={item}>
      <Card
        key={item.mediaID}
        className="overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors h-full relative"
        onClick={handleCardClick}
      >
        {activeUsers.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {activeUsers.length}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-semibold">Active users:</p>
                <ScrollArea className="h-full max-h-[100px]">
                  <ul className="list-disc pl-4">
                    {activeUsers.map(username => (
                      <li key={username} className="text-sm">{username}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <CardContent className="p-3 flex flex-col items-center justify-center select-none h-full w-full">
          {getMediaIcon()}
          <span className="text-sm font-medium text-center">
            {item.mediaName}
          </span>
        </CardContent>
      </Card>
    </FileItem>
  );
}