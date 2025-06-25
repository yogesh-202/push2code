'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const isActive = (path) => {
    return pathname === path ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400';
  };

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center text-xl font-bold text-gray-900 dark:text-white"
            >
              Push2Code
            </Link>
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 ${
                    isActive('/dashboard')
                  } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/problems"
                  className={`inline-flex items-center px-1 pt-1 ${
                    isActive('/dashboard/problems')
                  } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                >
                  Problems
                </Link>
                
                <Link 
                  href="/dashboard/core-subjects"
                  className={`inline-flex items-center px-1 pt-1  ${
                    isActive('/dashboard/core-subjects')
                  } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                >
                  Core Subjects
                </Link>
               
                <Link 
                  href="/dashboard/codeforces/profile"
                  className={`inline-flex items-center px-1 pt-1  ${
                    isActive('/dashboard/codeforces/profile')
                  } hover: text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                >
                  Codeforces
                </Link>
                <Link 
                  href="/dashboard/profile"
                  className={`inline-flex items-center px-1 pt-1  ${
                    isActive('/dashboard/profile')
                  } hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <ThemeToggle />
            
            {session ? (
              <div className="ml-4 flex items-center">
                
                <button
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
