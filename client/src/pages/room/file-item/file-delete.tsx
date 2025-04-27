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
  roomID: string;
  mediaObject: Types.MediaData;
  setOpen: (open: boolean) => void;
}

export function FileDelete({ roomID, mediaObject, setOpen }: FileUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.Media.deleteRoomMedia(roomID, mediaObject.mediaID!).then((success) => {
      if (success !== api.SuccessState.SUCCESS) {
        console.error('Error deleting file');
      }
      setIsLoading(false);
      setOpen(false);
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to delete {mediaObject.mediaName}?
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
