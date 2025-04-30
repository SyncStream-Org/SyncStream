import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Localize from '@/utilities/localize';
import { Types } from 'syncstream-sharedlib';

interface RoomHeaderProps {
  roomHome: boolean;
  activeDoc: Types.MediaData | null;
  activeStream: Types.MediaData | null;
}

export function RoomHeader({
  roomHome,
  activeDoc,
  activeStream,
}: RoomHeaderProps) {
  const localize = Localize.getInstance().localize();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {(activeDoc || activeStream) && (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {activeDoc
                    ? localize.roomPage.categories.documents
                    : localize.roomPage.categories.streams}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {activeDoc?.mediaName ||
                  activeStream?.mediaName ||
                  (roomHome
                    ? localize.roomPage.categories.home
                    : localize.roomPage.categories.settings)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
