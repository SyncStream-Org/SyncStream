import { useEffect } from 'react';
import { Types } from 'syncstream-sharedlib';
import {
  useWebRTCVideo,
  initiateVideoCall,
  closeVideoCall,
} from '@/api/routes/useWebRTCVideo';

interface StreamViewerProps {
  activeStream: Types.MediaData | null;
  roomID: string;
  sourceID: string;
  isClient: boolean;
}

export function StreamViewer({
  activeStream,
  roomID,
  sourceID,
  isClient,
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

  return (
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
  );
}
