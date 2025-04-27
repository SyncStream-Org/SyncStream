import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Types } from 'syncstream-sharedlib';
import { FileUpdate } from './file-update';
import { FileDelete } from './file-delete';

interface FileItemProps {
  roomID: string;
  mediaObject: Types.MediaData;
  children: React.ReactNode;
}

export function FileItem({ roomID, mediaObject, children }: FileItemProps) {
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64 bg-white dark:bg-gray-900">
          <ContextMenuItem inset onClick={() => setOpenUpdate(true)}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => setOpenDelete(true)}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogTrigger asChild>
          <button className="hidden" />
        </DialogTrigger>
        <FileUpdate
          roomID={roomID}
          mediaObject={mediaObject}
          setOpen={setOpenUpdate}
        />
      </Dialog>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogTrigger asChild>
          <button className="hidden" />
        </DialogTrigger>
        <FileDelete
          roomID={roomID}
          mediaObject={mediaObject}
          setOpen={setOpenDelete}
        />
      </Dialog>
    </>
  );
}
