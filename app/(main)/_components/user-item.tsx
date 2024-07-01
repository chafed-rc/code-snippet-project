
import { ChevronsLeftRight } from "lucide-react"

import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { User, useAuth } from '@/hooks/use-auth'; // Adjust the import path as necessary
import { Button } from "@/components/ui/button";


interface UserItemProps {
    user: User | null;
  }


export const UserItem = ({user}: UserItemProps) => {

    const { logout } = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
                    <div className="gap-x-2 flex items-center max-w-[150px]">
                        <span className="text-start font-medium line-clamp-1 text-white">{user?.username}&apos;s Codebase</span>
                    </div>
                    <ChevronsLeftRight className=" rotate-90 ml-2 text-muted-foreground h-4 w-4"/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-80"
                align="start"
                alignOffset={11}
                forceMount
            >
                <div className="flex flex-col space-y-4 p-2">
                    <p className="text-xm font-medium text-muted-foreground leading-none">
                        {user?.email}
                    </p>
                    <div className="flex items-center gap-x-2">
                        <div className="rounded-md bg-secondary p-1">
                            <Avatar className="h-8 w-8 items-center">
                                <Avatar className="flex items-center justify-center">{user?.username[0].toUpperCase()}</Avatar>
                            </Avatar>
                        </div>
                        <div className="space-y-1 ">
                            <p className="text-sm line-clamp-1">
                                {user?.username}&apos;s Codebase
                            </p>
                        </div>
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
                    <Button onClick={logout} className="bg-[#1f1f1f]">
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}