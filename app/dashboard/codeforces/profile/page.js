'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CodeforcesSummary from '@/components/CodeforcesSummary';

export default function CodeforcesProfile() {
  const router = useRouter();
  const [cfHandle, setCfHandle] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Get Codeforces handle from localStorage if available
    const savedHandle = localStorage.getItem('cfHandle');
    if (savedHandle) {
      setCfHandle(savedHandle);
      fetchProfileData(savedHandle);
    }
  }, [router]);
  
  async function fetchProfileData(handle) {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/codeforces/profile?handle=${handle}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  const handleSaveHandle = () => {
    if (cfHandle.trim()) {
      localStorage.setItem('cfHandle', cfHandle.trim());
      fetchProfileData(cfHandle.trim());
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Codeforces Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your Codeforces performance and stats
          </p>
        </div>
        
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="cf-handle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Codeforces Handle
              </label>
              <input
                type="text"
                id="cf-handle"
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
                placeholder="Enter your Codeforces handle"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleSaveHandle}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              Load Profile
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-white dark:bg-gray-800 rounded-lg"></div>
            <div className="h-80 bg-white dark:bg-gray-800 rounded-lg"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
            <p>{error}</p>
            <p className="mt-4">
              Please check that you've entered a valid Codeforces handle and try again.
              If the problem persists, Codeforces API might be temporarily unavailable.
            </p>
          </div>
        ) : (
          <CodeforcesSummary userData={profileData} />
        )}
        
        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Daily Practice
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get personalized daily practice problems based on your rating
            </p>
            <button
              onClick={() => router.push('/dashboard/codeforces/problems')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded text-center transition-colors"
            >
              Go to Practice
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Upcoming Contests
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View upcoming Codeforces contests and register
            </p>
            <a 
              href="https://codeforces.com/contests" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded text-center transition-colors"
            >
              View Contests
            </a>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Problem Sets
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Browse the complete Codeforces problem archive
            </p>
            <a 
              href="https://codeforces.com/problemset" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded text-center transition-colors"
            >
              Browse Problems
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}