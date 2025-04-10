'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WeeklyRevisionSheet from '@/components/WeeklyRevisionSheet';
import CriticalUnsolvedProblems from '@/components/CriticalUnsolvedProblems';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userObj = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userObj) {
      try {
        setUser(JSON.parse(userObj));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    
    // Simulate loading of dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? (
              <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <>Welcome, {user?.username || 'Programmer'}!</>
            )}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track your DSA practice progress and improve your skills
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Problem Sheets
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Practice problems organized by topic and difficulty
            </p>
            <Link 
              href="/dashboard/problems"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Problem Sheets
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Codeforces
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track your Codeforces profile and practice curated problems
            </p>
            <Link 
              href="/dashboard/codeforces/profile"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Codeforces Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Performance Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View your progress and identify areas for improvement
            </p>
            <Link 
              href="/dashboard/analytics"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Analytics
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Revision */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Weekly Revision Problems
              </h2>
              
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <WeeklyRevisionSheet />
              )}
            </div>
          </div>
          
          {/* Critical Topics */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Critical Topics
              </h2>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    These are your weakest topics that need attention:
                  </p>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="py-3">
                      <Link 
                        href="/dashboard/problems"
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded transition-colors"
                      >
                        <h3 className="font-medium text-red-600 dark:text-red-400">
                          View all critical topics
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Work on problems from these topics to improve your skills
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Upcoming Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Coming Soon
              </h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  LeetCode Integration
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Study Group Features
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Interview Preparation
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Critical Unsolved Problems */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Critical Unsolved Problems
            </h2>
            
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ) : (
              <CriticalUnsolvedProblems />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}