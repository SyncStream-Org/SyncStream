import { useState, useEffect, useCallback, useRef } from 'react';
import { createEventSource } from 'eventsource-client';
import { Types, Validation } from 'syncstream-sharedlib';
import { generateRoute } from '../utilities';

export function useRoomSSE(
  roomID: string,
  token: string,
  onMediaUpdate: (type: Types.UpdateType, update: Types.MediaData) => void,
  onRoomUpdate: (type: Types.UpdateType, update: Types.RoomUpdateData) => void,
  onUserUpdate: (type: Types.UpdateType, update: Types.RoomUserUpdateData) => void,
) {
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<any>(null);

  const connect = useCallback(() => {
    try {
      eventSourceRef.current = createEventSource({
        url: generateRoute(`user/rooms/${roomID}/broadcast`),
        headers: {
          'Session-Token': token,
        },
        onConnect: () => {
          setError(null);
        },
        onMessage: (event) => {
          try {
            const data = JSON.parse(event.data);
            if (!Validation.isRoomBroadcastUpdate(data)) {
              throw new Error('Invalid media update data');
            }
            switch (data.endpoint) {
              case 'media':
                onMediaUpdate(data.type, data.data);
                break;
              case 'room':
                onRoomUpdate(data.type, data.data);
                break;
              case 'user':
                onUserUpdate(data.type, data.data);
                break;
              default:
                console.warn(`Unknown endpoint: ${data.endpoint}`);
                break;
            }
          } catch (err) {
            setError(
              err instanceof Error ? err : new Error('Failed to parse message'),
            );
          }
        },
        onDisconnect: () => {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        },
      });
      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to establish SSE connection'),
      );
      return () => {};
    }
  }, [roomID, token, onMediaUpdate]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    error,
  };
}
