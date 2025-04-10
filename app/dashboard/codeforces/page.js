'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CodeforcesDashboard() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Codeforces Practice</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Improve your competitive programming skills with Codeforces problems and profile analytics
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <img 
            src="https://codeforces.org/s/0/android-icon-192x192.png"
            alt="Codeforces Logo"
            className="h-10 w-10 mr-2"
          />
          <a 
            href="https://codeforces.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Visit Codeforces →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-indigo-600 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-80"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Profile Analysis</h2>
              <p className="text-indigo-100">Track your performance and statistics</p>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Connect your Codeforces handle
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                View your submission statistics
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Track your rating history
              </li>
            </ul>
            <Link href="/dashboard/codeforces/profile">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Go to Profile
              </button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-green-600 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-80"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Curated Problem Set</h2>
              <p className="text-green-100">100 carefully selected problems</p>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Problems organized by difficulty
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Filter by topic and difficulty
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Track your solved problems
              </li>
            </ul>
            <Link href="/dashboard/codeforces/problems">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Browse Problems
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Practice with Codeforces?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contest Experience</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Codeforces hosts regular programming contests with rated problems that can help improve your competitive programming skills.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Problem Quality</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Problems are carefully designed by competitive programmers and cover a wide range of algorithms and data structures.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Global Community</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Join a community of over 500,000 programmers worldwide who use Codeforces to improve their skills.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link href="/dashboard">
          <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-md transition-colors">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}