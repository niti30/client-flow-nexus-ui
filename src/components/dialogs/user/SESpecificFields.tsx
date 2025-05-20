
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ClientSelectionField } from "./ClientSelectionField";

interface SESpecificFieldsProps {
  clients: { id: string; name: string }[];
  selectedClients: string[];
  setSelectedClients: (clients: string[]) => void;
  clientsLoading: boolean;
  popoverOpen: boolean;
  setPopoverOpen: (open: boolean) => void;
}

export function SESpecificFields({
  clients,
  selectedClients,
  setSelectedClients,
  clientsLoading,
  popoverOpen,
  setPopoverOpen
}: SESpecificFieldsProps) {
  const form = useFormContext();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cost_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Rate ($/hr)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="75" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bill_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Rate ($/hr)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="150" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ClientSelectionField
        clients={clients}
        selectedClients={selectedClients}
        setSelectedClients={setSelectedClients}
        isLoading={clientsLoading}
        popoverOpen={popoverOpen}
        setPopoverOpen={setPopoverOpen}
      />
    </>
  );
}
