
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  url: string;
}

interface ClientDocumentLinksProps {
  clientId: string;
}

const documentFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

export function ClientDocumentLinks({ clientId }: ClientDocumentLinksProps) {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: 'Survey Questions', url: 'https://docs.example.com/survey' },
    { id: '2', title: 'Survey Results', url: 'https://docs.example.com/results' },
    { id: '3', title: 'Process Documentation', url: 'https://docs.example.com/process' },
    { id: '4', title: 'ADA Proposal', url: 'https://docs.example.com/proposal' },
    { id: '5', title: 'Contract', url: 'https://docs.example.com/contract' },
    { id: '6', title: 'Factory Markdown', url: 'https://docs.example.com/factory-markdown' },
    { id: '7', title: 'Test Plan', url: 'https://docs.example.com/test-plan' },
  ]);
  
  const { toast } = useToast();
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = (values: DocumentFormValues) => {
    const newDocument: Document = {
      id: Date.now().toString(),
      ...values,
    };
    
    setDocuments([...documents, newDocument]);
    toast({
      title: "Document Added",
      description: `${values.title} has been added to document links.`,
    });
    setOpen(false);
    form.reset();
  };

  return (
    <>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="mb-2">
            <div className="text-sm font-medium text-gray-600">{doc.title}</div>
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline text-sm"
            >
              {doc.url}
            </a>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Document Link</DialogTitle>
            <DialogDescription>
              Add a new document link for this client. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Contract" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://docs.example.com/document" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Document</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
