import { useState, FormEvent } from 'react';
import { Types } from 'syncstream-sharedlib';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as api from '../../../api';

interface FileUpdateProps {
  room: Types.RoomData;
  setOpen: (open: boolean) => void;
}

export function RoomLeave({ room, setOpen }: FileUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.User.leaveRoom(room.roomID!).then(async (res) => {
      if (res !== api.SuccessState.SUCCESS) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Error',
          message:
            'Something went wrong with the server and we could not remove you from the room.',
        });
      }
      setIsLoading(false);
      setOpen(false);
    });
  };

  return (
    <DialogContent
      onCloseAutoFocus={(e) => {
        e.preventDefault();
      }}
    >
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to leave {room.roomName}? You will need to be
          invited back to rejoin.
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogFooter>
          <Button type="submit" variant="destructive" disabled={isLoading}>
            {isLoading ? 'Leaving...' : 'Leave'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
