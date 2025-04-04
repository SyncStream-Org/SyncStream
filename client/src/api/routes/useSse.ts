import { useState, useEffect, useCallback, useRef } from 'react';
import { createEventSource } from 'eventsource-client';
import { Types } from 'syncstream-sharedlib';
import { generateRoute } from '../utilities';

export function useSSE(
  roomID: string,
  token: string,
  onMediaUpdate: (type: Types.UpdateType, update: Types.FileData) => void,
) {
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<any>(null);

  const connect = useCallback(() => {
    try {
      // Create new EventSource connection
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
            switch (data.endpoint) {
              case 'media':
                onMediaUpdate(data.type, data.update);
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

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    error,
  };
}
