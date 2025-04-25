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

interface PresenceData {
  users: string[];
  isServerSet?: boolean;
}

interface StreamViewerProps {
  activeStream: Types.MediaData | null;
  presenceData?: PresenceData;
  roomID: string;
}

export function StreamViewer({
  activeStream,
  presenceData,
  roomID,
}: StreamViewerProps) {
  const [sourceID, setSourceID] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const [sources, setSources] = useState<any[]>([]);

  useWebRTCVideo();

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
        style={{
          width: '100%',
          height: 'auto',
          display: isClient !== null ? 'block' : 'none',
        }}
      >
        <track kind="captions" hidden />
      </video>
      {isClient === null && (
        <div className="w-full h-full content-center">
          <div className="flex flex-row">
            <div className="flex-auto" />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={async () => {
                    const ret =
                      await window.electron.ipcRenderer.invokeFunction(
                        'get-video-sources',
                      );
                    setSources(ret);
                  }}
                  disabled={presenceData?.isServerSet}
                >
                  Start a Video Stream
                </Button>
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
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </DialogContent>
            </Dialog>
            <Button
              className="ml-6"
              onClick={() => {
                setIsClient(true);
              }}
              disabled={!presenceData?.isServerSet}
            >
              Join Stream
            </Button>
            <div className="flex-auto" />
          </div>
        </div>
      )}
    </>
  );
}
