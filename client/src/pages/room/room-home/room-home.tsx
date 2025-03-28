import { useState } from 'react';
import { Types } from 'syncstream-sharedlib';
import { DocCard } from './doc-card';
import { HomeToolbar } from './home-toolbar';

interface RoomHomeProps {
  media: Types.FileData[];
  roomID: string;
  refresh: () => void;
  setActiveDoc: (doc: Types.FileData | null) => void;
  setActiveStream: (stream: Types.FileData | null) => void;
  setActiveVoice: (voice: Types.FileData | null) => void;
}

export function RoomHome({
  media,
  roomID,
  refresh,
  setActiveDoc,
  setActiveStream,
  setActiveVoice,
}: RoomHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('type');

  const filteredMedia = media.filter((item) => {
    const matchesType =
      mediaTypeFilter.length === 0 ||
      mediaTypeFilter.includes(item.fileExtension);

    const matchesSearch = item.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const filteredAndSortedMedia = filteredMedia.sort((a, b) => {
    if (sortOption === 'type') {
      return a.fileExtension.localeCompare(b.fileExtension);
    }
    if (sortOption === 'name') {
      return a.fileName.localeCompare(b.fileName);
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
              key={item.fileID}
              item={item}
              setActiveDoc={setActiveDoc}
              setActiveStream={setActiveStream}
              setActiveVoice={setActiveVoice}
              roomID={roomID}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No media found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomHome;
