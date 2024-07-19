"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSnippets } from "@/hooks/use-snippets"

interface LanguageProps {
    initialData: {
        id: number;
        language: string;
    };
    className?: string;
}

export const Language = ({
    initialData,
    className,
}: LanguageProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { updateSnippet } = useSnippets();
    const [language, setLanguage] = useState(initialData.language || "N/A");
    const [isEditing, setIsEditing] = useState(false);

    const enableInput = () => {
        setLanguage(initialData.language);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
    };

    const updateLanguage = async (newLanguage: string) => {
        try {
            await updateSnippet(initialData.id, { language: newLanguage });
        } catch (error) {
            console.error('Failed to update snippet language:', error);
            // Optionally, show an error message to the user
        }
    };

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLanguage = event.target.value || "N/A";
        setLanguage(newLanguage);
        await updateLanguage(newLanguage);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            disableInput();
        }
    };

    return (
        <div className={`flex items-center gap-x-1 ${className}`}>
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={language.toUpperCase()}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button onClick={enableInput} variant="ghost" size="sm">
                    {language.toUpperCase()}
                </Button>
            )}
        </div>
    );
};
