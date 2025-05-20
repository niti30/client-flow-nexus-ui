
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClientSelectionFieldProps {
  clients: { id: string; name: string }[];
  selectedClients: string[];
  setSelectedClients: (clients: string[]) => void;
  isLoading: boolean;
  popoverOpen: boolean;
  setPopoverOpen: (open: boolean) => void;
}

export function ClientSelectionField({
  clients = [],
  selectedClients = [],
  setSelectedClients,
  isLoading,
  popoverOpen,
  setPopoverOpen
}: ClientSelectionFieldProps) {
  const form = useFormContext();

  // Safely handle client selection and deselection
  const handleClientSelection = (clientId: string) => {
    const isSelected = selectedClients.includes(clientId);
    const updatedSelection = isSelected
      ? selectedClients.filter((id) => id !== clientId)
      : [...selectedClients, clientId];
    
    // Update the form value and state
    form.setValue("assigned_clients", updatedSelection);
    setSelectedClients(updatedSelection);
  };

  return (
    <FormField
      control={form.control}
      name="assigned_clients"
      render={() => (
        <FormItem>
          <FormLabel>Assigned Clients</FormLabel>
          <FormControl>
            <Popover 
              open={popoverOpen} 
              onOpenChange={setPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : selectedClients.length > 0 ? (
                    `${selectedClients.length} client${selectedClients.length > 1 ? "s" : ""} selected`
                  ) : (
                    "Select clients..."
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading clients...</p>
                  </div>
                ) : clients && clients.length > 0 ? (
                  <Command>
                    <CommandInput placeholder="Search clients..." />
                    <CommandList>
                      <CommandEmpty>No clients found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-52">
                          {clients.map((client) => (
                            <CommandItem
                              key={client.id}
                              onSelect={() => handleClientSelection(client.id)}
                              className="flex items-center px-2 py-1"
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                <Checkbox
                                  checked={selectedClients.includes(client.id)}
                                  onCheckedChange={() => handleClientSelection(client.id)}
                                  className="mr-2"
                                  aria-label={`Select ${client.name}`}
                                />
                                <span>{client.name}</span>
                              </div>
                              {selectedClients.includes(client.id) && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                ) : (
                  <div className="p-4 text-center text-sm">
                    No clients available to assign.
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
