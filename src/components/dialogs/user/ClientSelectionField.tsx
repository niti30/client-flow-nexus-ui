
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface ClientSelectionFieldProps {
  clients: { id: string; name: string }[];
  selectedClients: string[];
  setSelectedClients: (clients: string[]) => void;
  isLoading: boolean;
  popoverOpen: boolean;
  setPopoverOpen: (open: boolean) => void;
}

export function ClientSelectionField({
  clients,
  selectedClients,
  setSelectedClients,
  isLoading,
  popoverOpen,
  setPopoverOpen,
}: ClientSelectionFieldProps) {
  const [searchValue, setSearchValue] = useState("");

  const toggleClient = (clientId: string) => {
    setSelectedClients(
      selectedClients.includes(clientId)
        ? selectedClients.filter((id) => id !== clientId)
        : [...selectedClients, clientId]
    );
  };

  // Filter clients based on search
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Get names of selected clients for display
  const selectedClientNames = selectedClients
    .map((id) => {
      const client = clients.find((c) => c.id === id);
      return client ? client.name : "";
    })
    .filter(Boolean);

  return (
    <div className="space-y-2">
      <FormLabel>Assigned Clients</FormLabel>
      
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-full justify-between h-auto min-h-10 py-2"
          >
            {selectedClients.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedClientNames.map((name) => (
                  <Badge key={name} variant="secondary">
                    {name}
                  </Badge>
                ))}
              </div>
            ) : (
              "Select clients..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Search clients..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading..." : "No clients found."}
              </CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  // Show skeletons while loading
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="px-2 py-1.5">
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))
                ) : (
                  // Show filtered clients
                  filteredClients.map((client) => {
                    const isSelected = selectedClients.includes(client.id);
                    return (
                      <CommandItem
                        key={client.id}
                        value={client.id}
                        onSelect={() => toggleClient(client.id)}
                        className={cn(
                          "flex items-center gap-2",
                          isSelected ? "bg-secondary/20" : ""
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span>{client.name}</span>
                      </CommandItem>
                    );
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
