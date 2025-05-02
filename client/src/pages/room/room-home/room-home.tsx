import { useState } from 'react';
import { Types } from 'syncstream-sharedlib';
import Localize from '@/utilities/localize';
import { DocCard } from './doc-card';
import { HomeToolbar } from './home-toolbar';

interface RoomHomeProps {
  media: Types.MediaData[];
  roomID: string;
  refresh: () => void;
  setActiveDoc: (doc: Types.MediaData | null) => void;
  setActiveStream: (stream: Types.MediaData | null) => void;
  setActiveVoice: (voice: Types.MediaData | null) => void;
  mediaPresence: Map<string, Omit<Types.MediaPresenceData, 'mediaID'>>;
}

export function RoomHome({
  media,
  roomID,
  refresh,
  setActiveDoc,
  setActiveStream,
  setActiveVoice,
  mediaPresence,
}: RoomHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('type');

  const localize = Localize.getInstance().localize();

  const filteredMedia = media.filter((item) => {
    const matchesType =
      mediaTypeFilter.length === 0 || mediaTypeFilter.includes(item.mediaType);

    const matchesSearch = item.mediaName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const filteredAndSortedMedia = filteredMedia.sort((a, b) => {
    if (sortOption === 'type') {
      return a.mediaType.localeCompare(b.mediaType);
    }
    if (sortOption === 'name') {
      return a.mediaName.localeCompare(b.mediaName);
    }
    return 0;
  });

  return (
    <div className="p-6">
      <HomeToolbar
        onSearch={setSearchQuery}
        onFilterChange={setMediaTypeFilter}
        onSortChange={setSortOption}
        roomID={roomID}
        refresh={refresh}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {filteredAndSortedMedia.length > 0 ? (
          filteredAndSortedMedia.map((item) => (
            <DocCard
              key={item.mediaID}
              item={item}
              setActiveDoc={setActiveDoc}
              setActiveStream={setActiveStream}
              setActiveVoice={setActiveVoice}
              roomID={roomID}
              activeUsers={mediaPresence.get(item.mediaID!)?.users}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {localize.roomPage.noMedia}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomHome;
