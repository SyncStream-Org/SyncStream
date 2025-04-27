import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StreamDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectStream: (sourceID: string) => void;
}

export function StreamDialog({
  open,
  setOpen,
  onSelectStream,
}: StreamDialogProps) {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSources() {
      const ret =
        await window.electron.ipcRenderer.invokeFunction('get-video-sources');
      setSources(ret);
    }
    if (open === true) {
      fetchSources();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            No Stream Started - Select a Window or Screen to Share
          </DialogTitle>
        </DialogHeader>
        <Select
          onValueChange={(sourceID: string) => {
            onSelectStream(sourceID);
            setOpen(false);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Source to Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sources</SelectLabel>
              {sources.map((source: any) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  );
}
