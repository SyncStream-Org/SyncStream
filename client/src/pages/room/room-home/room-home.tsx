import { useState } from 'react';
import { Types } from 'syncstream-sharedlib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { DocCard } from './doc-card';

interface RoomHomeProps {
  media: Types.FileData[];
}

export function RoomHome({ media }: RoomHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string | null>(null);

  // Filter media by fileExtension (which can only be 'doc' for documents) and search query
  const filteredMedia = media.filter((item) => {
    // Match by file extension
    const matchesType = mediaTypeFilter
      ? // For 'document' type, check for 'doc' extension
        (mediaTypeFilter === 'document' && item.fileExtension === 'doc') ||
        // For 'stream' type
        (mediaTypeFilter === 'stream' && item.fileExtension === 'stream') ||
        // For 'voice' type
        (mediaTypeFilter === 'voice' && item.fileExtension === 'voice')
      : true;

    // Match by filename
    const matchesSearch = item.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const mediaTypeOptions = [
    { label: 'All', value: null },
    { label: 'Documents', value: 'document' },
    { label: 'Streams', value: 'stream' },
    { label: 'Voice Channels', value: 'voice' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room Media</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Media</DialogTitle>
              <DialogDescription>
                Choose the type of media you want to create
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="document">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="document">Document</TabsTrigger>
                  <TabsTrigger value="stream">Stream</TabsTrigger>
                  <TabsTrigger value="voice">Voice Channel</TabsTrigger>
                </TabsList>
                <TabsContent value="document" className="p-4">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Document Name
                      </label>
                      <Input placeholder="Enter document name" />
                    </div>
                    <Button type="submit">Create Document</Button>
                  </form>
                </TabsContent>
                <TabsContent value="stream" className="p-4">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Stream Name
                      </label>
                      <Input placeholder="Enter stream name" />
                    </div>
                    <Button type="submit">Create Stream</Button>
                  </form>
                </TabsContent>
                <TabsContent value="voice" className="p-4">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Voice Channel Name
                      </label>
                      <Input placeholder="Enter voice channel name" />
                    </div>
                    <Button type="submit">Create Voice Channel</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <Select
          value={mediaTypeFilter!}
          onValueChange={(value) => setMediaTypeFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {mediaTypeOptions.map((option) => (
              <SelectItem key={option.label} value={option.value!}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.length > 0 ? (
          filteredMedia.map((item) => (
            <DocCard
              key={item.fileId}
              item={item}
              setActiveDoc={() => {}}
              setActiveStream={() => {}}
              setActiveVoice={() => {}}
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
