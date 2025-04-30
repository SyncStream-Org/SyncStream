import { useState, FormEvent } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as api from '../../../api';
import Localize from '@/utilities/localize';

interface FileCreateProps {
  roomID: string;
  setOpen: (open: boolean) => void;
}

export function FileCreate({ roomID, setOpen }: FileCreateProps) {
  const [mediaName, setMediaName] = useState('');
  const [mediaType, setMediaType] = useState('doc');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.Media.createMedia(roomID, {
      mediaName,
      mediaType,
      permissions: {
        canEdit: true,
      },
    }).then(({ success, data }) => {
      if (success !== api.SuccessState.SUCCESS) {
        console.error('Error creating file:', data);
      }
      setIsLoading(false);
      setMediaName('');
      setMediaType('doc');
      setOpen(false);
    });
  };

  const localize = Localize.getInstance().localize();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{localize.roomPage.createMedia.title}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {localize.roomPage.createMedia.name}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileType" className="text-right">
              {localize.roomPage.createMedia.type}
            </Label>
            <div className="col-span-3">
              <Select
                value={mediaType}
                onValueChange={setMediaType}
                disabled={isLoading}
              >
                <SelectTrigger id="fileType">
                  <SelectValue
                    placeholder={localize.roomPage.createMedia.typePlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doc">
                    {localize.roomPage.categories.document}
                  </SelectItem>
                  <SelectItem value="stream">
                    {localize.roomPage.categories.stream}
                  </SelectItem>
                  <SelectItem value="voice">
                    {localize.roomPage.categories.voiceChannel}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '...' : localize.roomPage.createMedia.submit}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
