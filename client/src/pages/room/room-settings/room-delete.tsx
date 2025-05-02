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

export function RoomDelete({ room, setOpen }: FileUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);

  const localize = Localize.getInstance().localize();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.Rooms.deleteRoom(room.roomID!).then(async (res) => {
      if (res !== api.SuccessState.SUCCESS) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.roomPage.messageBox.errorTitle,
          message: localize.roomPage.messageBox.roomDeleteError,
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
          {localize.roomPage.roomSettings.deleteCheck.Part1}
          {room.roomName}
          {localize.roomPage.roomSettings.deleteCheck.Part2}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogFooter>
          <Button type="submit" variant="destructive" disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
