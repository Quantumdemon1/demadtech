import React, { useState } from 'react';
import { Check, ChevronsUpDown, Loader2, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { searchDonorsAPI } from '@/services/api/donor';
import { cn } from '@/lib/utils';

interface Donor {
  donorGuid: string;
  donorName: string;
  email?: string;
}

interface DonorSearchProps {
  onSelect: (donorGuid: string) => void;
  selectedDonorGuid?: string;
  loginUsername: string;
  disabled?: boolean;
}

const DonorSearch: React.FC<DonorSearchProps> = ({
  onSelect,
  selectedDonorGuid,
  loginUsername,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  
  const { data: donors, isLoading } = useQuery({
    queryKey: ['donors', loginUsername, searchQuery],
    queryFn: () => searchDonorsAPI(loginUsername, searchQuery),
    enabled: !!loginUsername && open && searchQuery.length > 1,
    staleTime: 60000, // Cache for 1 minute
  });

  const handleSelect = (donor: Donor) => {
    setSelectedDonor(donor);
    onSelect(donor.donorGuid);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedDonor ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 opacity-50" />
              <span>{selectedDonor.donorName}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select donor...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="flex items-center px-2 border-b">
            <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
            <CommandInput 
              placeholder="Search donors..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && <CommandEmpty>No donors found.</CommandEmpty>}
            {donors && donors.length > 0 && (
              <CommandGroup>
                {donors.map((donor: Donor) => (
                  <CommandItem
                    key={donor.donorGuid}
                    value={donor.donorGuid}
                    onSelect={() => handleSelect(donor)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDonorGuid === donor.donorGuid ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{donor.donorName}</span>
                      {donor.email && (
                        <span className="text-xs text-muted-foreground">{donor.email}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DonorSearch;
