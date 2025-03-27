import { useState, ChangeEvent } from 'react';
import { Search, Filter, SortDesc, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { FileCreate } from './file-create';

interface HomeToolbarProps {
  roomID: string;
  onSearch: (term: string) => void;
  onFilterChange: (filters: string[]) => void;
  onSortChange: (sortOption: string) => void;
}

export function HomeToolbar({
  roomID,
  onSearch,
  onFilterChange,
  onSortChange,
}: HomeToolbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [open, setOpen] = useState(false);

  const filterOptions = [
    { value: 'doc', label: 'Document' },
    { value: 'stream', label: 'Stream' },
    { value: 'voice', label: 'Voice Channel' },
  ];
  const sortOptions = [
    { value: 'type', label: 'Type' },
    { value: 'name', label: 'Name' },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) => {
      const newFilters = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];

      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSortSelect = (sort: string) => {
    setSortOption(sort);
    onSortChange(sort);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 flex-grow">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 focus-visible:ring-0"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              size="default"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {filterOptions.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.value}
                checked={activeFilters.includes(filter.value)}
                onCheckedChange={() => handleFilterToggle(filter.value)}
                onSelect={(e) => e.preventDefault()}
              >
                {filter.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              size="default"
              className="flex items-center gap-1"
            >
              <SortDesc className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={sortOption === option.value ? 'bg-accent' : ''}
                onClick={() => handleSortSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button size="default" className="ml-2" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </DialogTrigger>
        <FileCreate roomID={roomID} setOpen={setOpen} />
      </Dialog>
    </div>
  );
}
