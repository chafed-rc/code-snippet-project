'use client'
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLogin } from '@/hooks/use-login';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import Link from 'next/link';
import { UserButton } from './user-button';

export const Navbar = () => {

  const { isLoggedIn, user, logout, loading, setLoading } = useAuth();
  const loginModal = useLogin();

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

  return (
    <div className="p-6 flex items-center justify-between fixed top-0 text-white w-full z-50">
      <h1 className="text-xl font-bold">Codebase</h1>
      {loading ? (
        <Spinner />
      ) : isLoggedIn ? (
        <div className='flex flex-row gap-2'>
          <UserButton user={user} />
          <Button asChild variant="ghost" className='hover:bg-rose-500 hover:text-white transition-all ease-in-out duration-200'>
            <Link href="/snippets">Enter Codebase</Link>
          </Button>
        </div>
      ) : (
        <Button onClick={loginModal.onOpen} className="bg-rose-500 hover:bg-rose-600 font-semibold">
          Login
        </Button>
      )}
    </div>
  );
};