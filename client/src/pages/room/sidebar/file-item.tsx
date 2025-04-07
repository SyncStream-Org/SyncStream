import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import React from 'react';

interface FileItemProps {
  children: React.ReactNode;
}

export function FileItem({ children }: FileItemProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-white dark:bg-gray-900">
        <ContextMenuItem inset>Rename</ContextMenuItem>
        <ContextMenuItem inset>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Export as PDF</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
