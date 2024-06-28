'use client'

import { Button } from "@/components/ui/button"
import { useSignUp } from "@/hooks/use-signup"
import { ArrowRight } from "lucide-react"


export const Heading = () => {
    const singup = useSignUp();
    return (
        <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Store and share all your snippets in one place with Code<span className="text-rose-500">base</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium text-zinc-200">
                Never leave your code behind again, <br/> unlock your snippet superpower.
            </h3>
            <Button  onClick={singup.onOpen} className="bg-white text-[#1f1f1f] hover:bg-gray-300">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    )
}