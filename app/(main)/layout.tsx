'use client'

import { Spinner } from "@/components/spinner";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

const MainLayout = ({
    children
}: {
    children: React.ReactNode
}) => {

    const {isLoggedIn, loading} = useAuth();

    if(loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size={'lg'}/>
            </div>
        )
    }

    if(!isLoggedIn){
        return redirect('/');
    }

    return (
        <div className="h-full flex bg-[#1F1F1F]">
            <main className="flex-1 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

export default MainLayout;