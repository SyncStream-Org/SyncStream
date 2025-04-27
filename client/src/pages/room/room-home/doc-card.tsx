import { FileText, Monitor, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Types } from 'syncstream-sharedlib';
import { FileItem } from '../file-item/file-item';

interface DocCardProps {
  roomID: string;
  item: Types.MediaData;
  setActiveDoc: (doc: Types.MediaData | null) => void;
  setActiveStream: (stream: Types.MediaData | null) => void;
  setActiveVoice: (voice: Types.MediaData | null) => void;
}

export function DocCard({
  roomID,
  item,
  setActiveDoc,
  setActiveStream,
  setActiveVoice,
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

  return (
    <FileItem roomID={roomID} mediaObject={item}>
      <Card
        key={item.mediaID}
        className="overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors h-full"
        onClick={handleCardClick}
      >
        <CardContent className="p-3 flex flex-col items-center justify-center select-none h-full w-full">
          {(item.mediaType === 'doc' && (
            <FileText className="h-10 w-10 mb-2 text-blue-500" />
          )) ||
            (item.mediaType === 'stream' && (
              <Monitor className="h-10 w-10 mb-2 text-purple-500" />
            )) || <Mic className="h-10 w-10 mb-2 text-green-500" />}
          <span className="text-sm font-medium text-center">
            {item.mediaName}
          </span>
        </CardContent>
      </Card>
    </FileItem>
  );
}
