'use client'

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/hooks/use-signup";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/spinner';

export const Heading = () => {
    const signup = useSignUp();
    const { isLoggedIn, user, loading, setLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Simulate initial authentication check
        const checkAuth = async () => {
          setLoading(true);
          try {
            // Simulate a delay for checking authentication
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } finally {
            setLoading(false);
          }
        };
        checkAuth();
      }, [setLoading]);

    const handleButtonClick = () => {
        if (isLoggedIn && user) {
            // Navigate to codebase
            router.push('/codebase');
        } else {
            signup.onOpen();
        }
    };

    return (
        <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Store and share all your snippets in one place with Code<span className="text-rose-500">base</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium text-zinc-200">
                Never leave your code behind again, <br /> unlock your snippet superpower.
            </h3>
            <Button onClick={handleButtonClick} className="bg-white text-[#1f1f1f] hover:bg-gray-300">
                {loading ? (
                    <Spinner/>
                ) : isLoggedIn && user ? (
                    `Enter Codebase`
                ) : (
                    "Get Started"
                )}
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    );
};