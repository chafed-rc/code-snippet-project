"use client"

import { useState } from "react"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, CopyIcon, Globe } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import { useSnippets } from "@/hooks/use-snippets"

interface PublishProps {
    initialData: {
        id: number;
        isPublished: boolean;
    }
}

export const Publish = ({initialData}: PublishProps) => {

    const origin = useOrigin();
    const { updateSnippet } = useSnippets();

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData.id}`;

    const onPublish = () => {
        setIsSubmitting(true);
        const promise = updateSnippet(initialData.id, {
            isPublished: true
        })
            .finally(() => setIsSubmitting(false))
        toast.promise(promise, {
            loading: "Publishing...",
            success: "Form Published!",
            error: "Failed to publish."
        })
    }

    const onUnpublish = () => {
        setIsSubmitting(true);
        const promise = updateSnippet(initialData.id, {
            isPublished: false
        })
            .finally(() => setIsSubmitting(false))
        toast.promise(promise, {
            loading: "Unpublishing...",
            success: "Form Unpublished!",
            error: "Failed to unpublish."
        })
    }

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size={'sm'} variant={'ghost'}>
                    Publish
                    {initialData.isPublished && <Globe className="h-4 w-4 ml-2 text-rose-500"/>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="h-4 w-4 text-rose-500 animate-pulse"/>
                            <p className="text-xs font-medium text-rose-500">This form is hard at work on the web.</p>
                        </div>
                        <div className="flex items-center">
                            <input value={url} className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate select-none"/>
                            <Button onClick={onCopy} disabled={copied} className="h-8 rounded-l-none">
                                {copied ? (
                                    <Check className="h-4 w-4"/>
                                ) : (
                                    <CopyIcon className="h-4 w-4"/>
                                )}
                            </Button>
                        </div>
                        <Button size={'sm'} className="w-full text-xs" disabled={isSubmitting} onClick={onUnpublish}>
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe className="h-8 w-8 text-muted-foreground mb-2"/>
                        <p className="text-sm font-medium mb-2">Publish this Snippet</p>
                        <span className="text-xs text-muted-foreground mb-4">Share your code with others!</span>
                        <Button disabled={isSubmitting} onClick={onPublish} className="w-full text-xs" size={'sm'}>
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}