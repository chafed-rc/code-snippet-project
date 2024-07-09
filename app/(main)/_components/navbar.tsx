'use client'

import { useParams } from "next/navigation";
import { Globe, MenuIcon } from "lucide-react";
import { useGetSnippetById } from "@/hooks/use-get-by-Id";
import { Title } from "./title";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({
  isCollapsed,
  onResetWidth,
}: NavbarProps) => {
  const params = useParams();
  const { snippet, loading, error } = useGetSnippetById(params.snippetId as string);

  if (loading) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between">
      <Title.Skeleton />
  </nav>
    )
  }

  if (error || !snippet) {
    return null;
  }

  return (
    <>
      <nav className="bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4 text-white">
        {isCollapsed && (
          <MenuIcon 
            role="button" 
            onClick={onResetWidth} 
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={snippet} />
          <div className="flex items-center gap-x-2">
            <p className="font-medium">{snippet.language}</p>
            <Globe className="h-6 w-6 text-rose-500 cursor-pointer"/>
          </div>
        </div>
      </nav>
    </>
  )
}