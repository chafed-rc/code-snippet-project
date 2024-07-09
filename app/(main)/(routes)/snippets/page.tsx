'use client'

import { useRouter } from "next/navigation"
import { useAuth, User } from '@/hooks/use-auth'
import { Button } from "@/components/ui/button";
import { Database, PlusCircle } from "lucide-react";
import { useSnippets } from "@/hooks/use-snippets";
import { toast } from "sonner";

const SnippetPage = () => {
    const router = useRouter();
    const user = useAuth().user as User;
    const { createSnippet } = useSnippets();

    const onCreate = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        try {
            const newSnippet = await createSnippet({
                title: "Untitled",
                content: "// Type your snippet here",
                language: "javascript", // You might want to set a default language or allow user to choose
                tags: []
            });
            toast.success("New snippet created");
            router.push(`/snippets/${newSnippet.id}`);
        } catch (error) {
            console.error("Failed to create snippet:", error);
            toast.error("Failed to create snippet");
        }
    }

    const showUserName = user.username[0].toLocaleUpperCase() + user.username.slice(1);

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 text-white">
            <div>
                <Database className="text-rose-500 h-16 w-16 md:h-24 md:w-24" />
            </div>
            <h2 className="text-lg font-medium">
                Welcome to {showUserName}&apos;s Codebase
            </h2>
            <Button onClick={onCreate} className="bg-rose-500 hover:bg-rose-600">
                <PlusCircle size={24} className="h-4 w-4 mr-2" />
                Create a new snippet
            </Button>
        </div>
    )
}

export default SnippetPage;