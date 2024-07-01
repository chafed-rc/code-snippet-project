'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "./item";
import { Code } from "lucide-react";
import { useSnippets } from "@/hooks/use-snippets";

export const SnippetList = () => {
  const params = useParams();
  const router = useRouter();
  const { snippets, fetchSnippets } = useSnippets();

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const onRedirect = (snippetId: number) => {
    router.push(`/snippets/${snippetId}`);
  }

  console.log("All snippets:", snippets); // Debugging log

  if (snippets.length === 0) {
    return (
      <p className="text-sm font-medium text-white p-4">
        No snippets
      </p>
    );
  }

  const activeSnippets = snippets.filter(snippet => !snippet.is_archived);

  console.log("Active snippets:", activeSnippets); // Debugging log

  return (
    <>
      {activeSnippets.map((snippet) => (
        <div key={snippet.id}>
          <Item
            id={snippet.id}
            label={snippet.title}
            onClick={() => onRedirect(snippet.id)}
            icon={Code}
            active={params.snippetId === snippet.id.toString()}
          />
        </div>
      ))}
    </>
  )
}