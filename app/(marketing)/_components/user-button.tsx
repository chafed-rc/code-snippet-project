import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Avatar } from "@/components/ui/avatar"; // Adjust the import path as necessary
  import { User, useAuth } from '@/hooks/use-auth'; // Adjust the import path as necessary
  import { Button } from '@/components/ui/button';
  
  interface UserButtonProps {
    user: User | null;
  }
  
  export const UserButton: React.FC<UserButtonProps> = ({ user }) => {
    const { logout } = useAuth();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 bg-white text-black text-lg font-semibold rounded-full">
          <Avatar className="flex items-center justify-center">{user?.username[0].toUpperCase()}</Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="px-4 py-2">
            <div className="text-sm font-medium">{user?.username}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="px-4 py-2">
            <Button onClick={logout} className="w-full text-left">
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };