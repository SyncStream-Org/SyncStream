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
  mediaObject: Types.FileData;
  setOpen: (open: boolean) => void;
}

export function FileUpdate({ roomID, mediaObject, setOpen }: FileUpdateProps) {
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.Files.updateRoomFile(roomID, mediaObject.fileName, {
      fileName,
    }).then((success) => {
      if (success !== api.SuccessState.SUCCESS) {
        console.error('Error updating file');
      }
      setIsLoading(false);
      setFileName('');
      setOpen(false);
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Updating {mediaObject.fileName}</DialogTitle>
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
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
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
