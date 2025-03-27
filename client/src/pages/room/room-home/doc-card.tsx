import { FileText, Monitor, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Types } from 'syncstream-sharedlib';
import { FileItem } from '../file-item/file-item';

interface DocCardProps {
  roomID: string;
  item: Types.FileData;
  setActiveDoc: (doc: Types.FileData | null) => void;
  setActiveStream: (stream: Types.FileData | null) => void;
  setActiveVoice: (voice: Types.FileData | null) => void;
}

export function DocCard({ roomID, item, setActiveDoc, setActiveStream, setActiveVoice }: DocCardProps) {
  const handleCardClick = () => {
    if (item.fileExtension === 'doc') {
      setActiveDoc(item);
    } else if (item.fileExtension === 'stream') {
      setActiveStream(item);
    } else if (item.fileExtension === 'voice') {
      setActiveVoice(item);
    }
  };

  return (
    <FileItem roomID={roomID} mediaObject={item}>
      <Card 
        key={item.fileId} 
        className="overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors h-full"
        onClick={handleCardClick}
      >
        <CardContent className="p-3 flex flex-col items-center justify-center select-none h-full w-full">
          {item.fileExtension === 'doc' ? (
            <FileText className="h-10 w-10 mb-2 text-blue-500" />
          ) : item.fileExtension === 'stream' ? (
            <Monitor className="h-10 w-10 mb-2 text-purple-500" />
          ) : (
            <Mic className="h-10 w-10 mb-2 text-green-500" />
          )}
          <span className="text-sm font-medium text-center">{item.fileName}</span>
        </CardContent>
      </Card>
    </FileItem>
  );
}