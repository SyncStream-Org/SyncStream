import { useState, FormEvent } from 'react';
import { Types } from 'syncstream-sharedlib';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as api from '../../../api';

interface FileUpdateProps {
  roomID: string;
  mediaObject: Types.MediaData;
  setOpen: (open: boolean) => void;
}

export function FileUpdate({ roomID, mediaObject, setOpen }: FileUpdateProps) {
  const [mediaName, setMediaName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.Media.updateRoomMedia(roomID, mediaObject.mediaID!, {
      mediaName,
    }).then((success) => {
      if (success !== api.SuccessState.SUCCESS) {
        console.error('Error updating file');
      }
      setIsLoading(false);
      setMediaName('');
      setOpen(false);
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Updating {mediaObject.mediaName}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              New Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={mediaName}
              onChange={(e) => setMediaName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
