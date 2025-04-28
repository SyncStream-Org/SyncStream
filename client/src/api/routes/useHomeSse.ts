import { useState, useEffect, useCallback, useRef } from 'react';
import { createEventSource } from 'eventsource-client';
import { Types, Validation } from 'syncstream-sharedlib';
import { generateRoute } from '../utilities';

export function useHomeSse(
  token: string,
  onRoomUpdate: (type: Types.UpdateType, update: Types.RoomData) => void,
) {
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<any>(null);

  const connect = useCallback(() => {
    try {
      eventSourceRef.current = createEventSource({
        url: generateRoute(`user/broadcast`),
        headers: {
          'Session-Token': token,
        },
        onConnect: () => {
          setError(null);
        },
        onMessage: (event) => {
          try {
            const data = JSON.parse(event.data);
            if (!Validation.isUserBroadcastUpdate(data)) {
              throw new Error('Invalid media update data');
            }
            switch (data.endpoint) {
              case 'room':
                onRoomUpdate(data.type, data.data as Types.RoomData);
                break
              case 'presence':
                onPresenceUpdate(data.type, data.data as Types.UserPresenceData);
                break
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
  }, [token, onRoomUpdate]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    error,
  };
}
