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

interface FileCreateProps {
  roomID: string;
  setOpen: (open: boolean) => void;
}

export function FileCreate({ roomID, setOpen }: FileCreateProps) {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('doc');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    api.Files.createFile(roomID, {
      fileName,
      fileExtension: fileType,
      permissions: {
        canEdit: true,
      },
    }).then(({ success, data }) => {
      if (success !== api.SuccessState.SUCCESS) {
        console.error('Error creating file:', data);
      }
      setIsLoading(false);
      setFileName('');
      setFileType('doc');
      setOpen(false);
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Media</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Media Name
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileType" className="text-right">
              Media Type
            </Label>
            <div className="col-span-3">
              <Select
                value={fileType}
                onValueChange={setFileType}
                disabled={isLoading}
              >
                <SelectTrigger id="fileType">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doc">Document</SelectItem>
                  <SelectItem value="stream">Stream</SelectItem>
                  <SelectItem value="voice">Voice Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
