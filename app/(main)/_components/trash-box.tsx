"use client"

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { useSnippets } from "@/hooks/use-snippets"; // You'll need to create this hook
import { useAuth } from "@/hooks/use-auth";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const { snippets, restoreSnippet, removeSnippet } = useSnippets();
    const [search, setSearch] = useState("");

    const filteredSnippets = snippets?.filter((snippet) => {
        const titleMatches = snippet.title.toLowerCase().includes(search.toLowerCase());
        console.log(`Snippet ${snippet.id}: title match = ${titleMatches}, is_archived = ${snippet.is_archived}`);
        return titleMatches && snippet.is_archived;
    });

    const onClick = (snippetId: number) => { 
        router.push(`/snippets/${snippetId}`);
    };

    const onRestore = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        snippetId: number
    ) => {
        event.stopPropagation();
        toast.promise(restoreSnippet(snippetId), {
            loading: "Restoring...",
            success: "Restored",
            error: "Failed to restore",
        });
    }
    
    const onRemove = async (snippetId: number) => {
        toast.promise(removeSnippet(snippetId), {
            loading: "Deleting...",
            success: "Snippet deleted",
            error: "Failed to delete",
        });
        if (params.id === snippetId.toString()) {
            router.push("/snippets");
        }
    } 

    if (snippets === undefined) {
        return <div className="h-full flex items-center justify-center p-4"><Spinner size="lg"/></div>
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="w-4 h-4"/>
                <Input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary" 
                    placeholder="Filter by snippet title..." 
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No archived snippets found.
                </p>
                {filteredSnippets?.map((snippet) => (
                    <div 
                        key={snippet.id} 
                        role="button" 
                        onClick={() => onClick(snippet.id)} 
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                    >
                        <span className="truncate pl-2">{snippet.title}</span>
                        <div className="flex items-center">
                            <div 
                                onClick={(e) => onRestore(e, snippet.id)} 
                                role="button" 
                                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                            >
                                <Undo className="h-4 w-4 text-muted-foreground"/>
                            </div>
                            <ConfirmModal onConfirm={() => onRemove(snippet.id)}>
                                <div role="button" className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                                    <Trash className="h-4 w-4 text-muted-foreground"/>
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>  
        </div>
    )
}