'use client'

import { LucideIcon, MoreHorizontal, Plus, Trash, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth'; // Adjust the import path as necessary
import { useSnippets } from "@/hooks/use-snippets";

interface ItemProps {
    id?: number; // Assuming PostgreSQL uses numeric IDs
    snippetIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearched?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}

export const Item = ({ id, label, onClick, icon: Icon, active, snippetIcon, isSearched, level = 0, onExpand, expanded }: ItemProps) => {
    const { user, logout } = useAuth(); // Using the useAuth hook
    const router = useRouter();
    const { archiveSnippet } = useSnippets();


    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if(!id) return;
        // Implement your snippet creation logic here
        // For example:
        // const promise = createSnippet({ title: "Untitled", parentId: id });
        toast.promise(promise, {
            loading: "Creating snippet...",
            success: "Snippet created",
            error: "Failed to create snippet"
        });
    }

    const onArchive = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if (!id) return;
    
        try {
            await archiveSnippet(id);
            toast.success("Snippet moved to trash");
        } catch (error) {
            console.error("Failed to archive snippet:", error);
            toast.error("Failed to move snippet to trash");
        }
    };

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;
    
    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >

            {snippetIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                   {snippetIcon}
                </div>    
            ): (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-white" />
            )}
            <span className="truncate text-white">{label}</span>
            {isSearched && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground opacity-100">
                    <span className="text-xs">CRTL</span>K
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60 " align="start" side="right" forceMount>
                            <DropdownMenuItem onClick={onArchive} className=" cursor-pointer">
                                <Trash className="h-4 w-4 mr-2"/>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs text-muted-foreground p-2">
                                Last edited by: {user?.username}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({level}: {level?: number}) {
    return (
        <div style={{
            paddingLeft: level ? `${(level * 12) + 25}px` : '12px'
        }}
        className="flex gap-x-2 py-[3px]"
        >
          <Skeleton className="h-4 w-4"/>
          <Skeleton className="h-4 w-[30%]"/>    
        </div>
    );
}