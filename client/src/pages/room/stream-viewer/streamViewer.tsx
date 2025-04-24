import { useEffect, useState } from 'react';
import { Types } from 'syncstream-sharedlib';
import {
  useWebRTCVideo,
  initiateVideoCall,
  closeVideoCall,
} from '@/api/routes/useWebRTCVideo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StreamViewerProps {
  activeStream: Types.MediaData | null;
  roomID: string;
}

export function StreamViewer({ activeStream, roomID }: StreamViewerProps) {
  const [sourceID, setSourceID] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const [sources, setSources] = useState<any[]>([]);

  useWebRTCVideo();

  useEffect(() => {
    window.electron.ipcRenderer
      .invokeFunction('get-video-sources')
      .then((res) => {
        setSources(res);
      });
  }, []);

  useEffect(() => {
    if (isClient === false && sourceID !== null) {
      initiateVideoCall(roomID, activeStream?.mediaID!, false, sourceID);
    } else if (isClient === true) {
      initiateVideoCall(roomID, activeStream?.mediaID!, true);
    } else {
      closeVideoCall();
    }
  }, [sourceID, isClient, roomID, activeStream?.mediaID]);

  return (
    <>
      <video
        id="remoteVideoPlayer"
        autoPlay
        playsInline
        hidden={isClient !== null}
        style={{ width: '100%', height: 'auto' }}
      />
      {isClient === null && (
        <div className="flex flex-row">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Start a Video Stream</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select a Window or Screen to Share</DialogTitle>
              </DialogHeader>
              <Select
                onValueChange={(sourceIDSelect) => {
                  setSourceID(sourceIDSelect);
                  setIsClient(false);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Source to Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sources</SelectLabel>
                    {sources.map((source: any) => (
                      <SelectItem value={source.id}>{source.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => {
              setIsClient(true);
            }}
          >
            Join Stream
          </Button>
        </div>
      )}
    </>
  );
}
