"use client";

import { useState, useEffect } from "react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { useAuth } from "@/hooks/use-auth";
import { Snippet, useSnippets } from "@/hooks/use-snippets";

export const SearchCommand = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { snippets } = useSnippets(); // Destructure snippets from the object
  const [isMounted, setIsMounted] = useState(false);
  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: number) => {
    router.push(`/snippets/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.username}'s snippets...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Snippets">
          {snippets.map((snippet: Snippet) => (
            <CommandItem
              key={snippet.id}
              value={`${snippet.id}`}
              title={snippet.title}
              onSelect={() => onSelect(snippet.id)}
            >
              <File className="mr-2 h-4 w-4" />
              <span>{snippet.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};