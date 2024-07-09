'use client'

import { ChevronsLeft, MenuIcon, PlusCircle, Search } from "lucide-react"
import { ElementRef, useRef, useState, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserItem } from "./user-item";
import { useAuth } from "@/hooks/use-auth";
import { Item } from "./item";
import { useSearch } from "@/hooks/use-search";
import { SnippetList } from "./snippet-list";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { Navbar } from "./navbar";
import { useRouter } from "next/navigation";
import { useSnippets } from "@/hooks/use-snippets";

export const Navigation = () => {

    const {user} = useAuth();
    const search = useSearch();
    const params = useParams();
    const router = useRouter();

    const { createSnippet } = useSnippets();
    const pathname = usePathname();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        if(isMobile){
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile])

    useEffect(() => {
        if(isMobile) {
            collapse();
        }
    }, [pathname, isMobile])  

    useEffect(() => {
        console.log("Current params:", params);
    }, [params]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();
        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseMove = (event: MouseEvent) => {
        if(!isResizingRef.current) return;
        let newWidth = event.clientX;

        if(newWidth < 240) newWidth = 240;
        if(newWidth > 480) newWidth = 480;

        if(sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }
    
    const resetWidth = () => {
        if(sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);
            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
        }
        setTimeout(() => setIsResetting(false), 300);
    };

    const collapse = () => {
        if(sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("left", "0");
            navbarRef.current.style.setProperty("width", "100%");
            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const onCreate = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
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

    return (
        <>    
            <aside ref={sidebarRef} className={cn(
                    "group/sidebar h-full bg-[#333333] overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0",
                )}
                >
                <div onClick={collapse} role="button" className={cn(
                    "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                    isMobile && "opacity-100",
                )}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem user={user} />
                    <Item label="Search" icon={Search} isSearched onClick={(search.onOpen)} />
                    <Item onClick={onCreate} label="New Snippet" icon={PlusCircle} />
                </div>
                <div className="mt-4">
                    <SnippetList />
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash} />
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72" side={isMobile ? "bottom" : "right"}>
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-muted-foreground right-0 top-0"/>
            </aside>
            <div ref={navbarRef} className={cn(" absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full",
            )}>
                {params.snippetId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ) : (
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground"/>}
                    </nav>
                )}
            </div>
        </>    
    )
}