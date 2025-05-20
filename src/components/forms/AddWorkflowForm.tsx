
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  department: z.string().min(2, { message: "Department is required." }),
  description: z.string().optional(),
  nodes: z.coerce.number().min(0).default(0),
  executions: z.coerce.number().min(0).default(0),
  exceptions: z.coerce.number().min(0).default(0),
});

export type WorkflowFormValues = z.infer<typeof formSchema>;

interface AddWorkflowFormProps {
  onSubmit: (values: WorkflowFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddWorkflowForm({ onSubmit, onCancel, isSubmitting = false }: AddWorkflowFormProps) {
  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      description: "",
      nodes: 0,
      executions: 0,
      exceptions: 0,
    },
  });

  const handleSubmit = (values: WorkflowFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workflow Name</FormLabel>
              <FormControl>
                <Input placeholder="Lead Processing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Sales" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of the workflow" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="nodes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nodes</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="0" 
                    type="number" 
                    min="0" 
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="executions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Executions</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="0" 
                    type="number" 
                    min="0" 
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exceptions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exceptions</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="0" 
                    type="number" 
                    min="0" 
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Workflow"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
