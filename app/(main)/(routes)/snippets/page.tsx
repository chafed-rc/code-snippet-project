'use client'

import { useRouter } from "next/navigation"
import { useAuth, User } from '@/hooks/use-auth'
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const SnippetPage = () => {
    const router = useRouter();
    const user = useAuth().user as User;

    const showUserName = user.username[0].toLocaleUpperCase() + user.username.slice(1);

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 text-white">
            <h2 className="text-lg font-medium">
                Welcome to {showUserName}&apos;s Codebase
            </h2>
            <Button className="bg-rose-500 hover:bg-rose-600">
                <PlusCircle size={24} className="h-4 w-4 mr-2" />
                Create a new snippet
            </Button>
        </div>
    )
}

export default SnippetPage;