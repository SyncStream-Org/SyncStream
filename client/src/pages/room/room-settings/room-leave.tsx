import { useState, FormEvent } from 'react';
import { Types } from 'syncstream-sharedlib';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Localize from '@/utilities/localize';
import * as api from '../../../api';

interface FileUpdateProps {
  room: Types.RoomData;
  setOpen: (open: boolean) => void;
}

export function RoomLeave({ room, setOpen }: FileUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);

  const localize = Localize.getInstance().localize();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.User.leaveRoom(room.roomID!).then(async (res) => {
      if (res !== api.SuccessState.SUCCESS) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.roomPage.messageBox.errorTitle,
          message: localize.roomPage.messageBox.roomLeaveError,
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
          {localize.roomPage.roomSettings.leaveCheck.Part1}
          {room.roomName}
          {localize.roomPage.roomSettings.leaveCheck.Part2}
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
