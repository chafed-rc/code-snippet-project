'use client'

import { Button } from "@/components/ui/button"


export const Navbar = () => {
    return (
        <div className="p-6 flex items-center justify-between fixed top-0 text-white w-full z-50">
            <h1 className="text-xl font-bold">Codebase</h1>
            <Button className="bg-rose-500 hover:bg-rose-600 font-semibold">Login</Button>
        </div>
    )
}