'use client'

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSnippets } from "@/hooks/use-snippets"

interface TitleProps {
    initialData: {
        id: number;
        title: string;
    };
    className?: string;
}

export const Title = ({
    initialData,
    className,
}: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { updateSnippet } = useSnippets();
    const [title, setTitle] = useState(initialData.title || "Untitled");
    const [isEditing, setIsEditing] = useState(false);

    const enableInput = () => {
        setTitle(initialData.title)
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0);
    }

    const disableInput = () => {
        setIsEditing(false);
    }

    const onChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newTitle = event.target.value || "Untitled";
        setTitle(newTitle);
        try {
            await updateSnippet(initialData.id, { title: newTitle });
        } catch (error) {
            console.error('Failed to update snippet title:', error);
            // You might want to show an error message to the user here
        }
    }

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if(event.key === "Enter") {
            disableInput();
        }
    }

    return (
        <div className="flex items-center gap-x-1">
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button onClick={enableInput} variant="ghost" size="lg" className="font-normal h-auto p-1">
                    <span className="truncate md:max-w-2xl max-w-[60px]">
                        {title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-16 rounded-md"/>
    )
}