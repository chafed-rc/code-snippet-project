"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useSnippets } from "@/hooks/use-snippets"

interface PublishProps {
    initialData: {
        id: number;
        is_published: boolean;
    }
}

export const Publish = ({initialData}: PublishProps) => {
    const { updateSnippet } = useSnippets();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPublished, setIsPublished] = useState(initialData.is_published);

    const togglePublish = () => {
        setIsSubmitting(true);
        const newPublishState = !isPublished;
        const promise = updateSnippet(initialData.id, {
            is_published: newPublishState
        })
            .then(() => {
                setIsPublished(newPublishState);
            })
            .finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: newPublishState ? "Publishing..." : "Unpublishing...",
            success: newPublishState ? "Snippet Published!" : "Snippet Unpublished!",
            error: newPublishState ? "Failed to publish." : "Failed to unpublish."
        });
    }

    return (
        <Button 
            onClick={togglePublish} 
            disabled={isSubmitting}
            variant={isPublished ? "destructive" : "default"}
            size="sm"
        >
            {isPublished ? "Unpublish" : "Publish"}
        </Button>
    )
}