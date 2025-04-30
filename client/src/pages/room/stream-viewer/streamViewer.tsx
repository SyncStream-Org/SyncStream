import { useEffect } from 'react';
import { Types } from 'syncstream-sharedlib';
import {
  useWebRTCVideo,
  initiateVideoCall,
  closeVideoCall,
} from '@/api/routes/useWebRTCVideo';
import { Button } from '@/components/ui/button';
import Localize from '@/utilities/localize';

interface StreamViewerProps {
  activeStream: Types.MediaData | null;
  roomID: string;
  sourceID: string;
  isClient: boolean;
  handleClose: () => void;
}

export function StreamViewer({
  activeStream,
  roomID,
  sourceID,
  isClient,
  handleClose,
}: StreamViewerProps) {
  useWebRTCVideo();

  useEffect(() => {
    if (isClient === false && sourceID !== '') {
      initiateVideoCall(roomID, activeStream?.mediaID!, false, sourceID);
    } else if (isClient === true) {
      initiateVideoCall(roomID, activeStream?.mediaID!, true);
    } else {
      closeVideoCall();
    }
  }, [sourceID, isClient, roomID, activeStream?.mediaID]);

  const localize = Localize.getInstance().localize();

  return (
    <>
      <video
        id="remoteVideoPlayer"
        autoPlay
        style={{
          width: 'auto',
          height: 'auto',
          display: isClient !== null ? 'block' : 'none',
        }}
      >
        <track kind="captions" hidden />
      </video>
      <Button
        onClick={() => {
          closeVideoCall();
          handleClose();
        }}
        className="mx-auto mt-4"
        variant="destructive"
      >
        {isClient
          ? localize.roomPage.streamViewer.leave
          : localize.roomPage.streamViewer.stop}
      </Button>
    </>
  );
}
