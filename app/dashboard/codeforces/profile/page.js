'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeforcesSummary from '@/components/CodeforcesSummary';
import CodeforcesRatingChart from '@/components/CodeforcesRatingChart';

export default function CodeforcesProfile() {
  const [handle, setHandle] = useState('');
  const [inputHandle, setInputHandle] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Load saved handle from localStorage on initial load
  useEffect(() => {
    const savedHandle = localStorage.getItem('codeforcesHandle');
    if (savedHandle) {
      setHandle(savedHandle);
      setInputHandle(savedHandle);
    }
  }, []);
  
  // Fetch profile data when handle changes
  useEffect(() => {
    async function fetchProfileData() {
      if (!handle) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/codeforces/profile?handle=${handle}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile data');
        }
        
        setProfileData(data);
        // Save handle to localStorage
        localStorage.setItem('codeforcesHandle', handle);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Something went wrong');
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfileData();
  }, [handle]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputHandle.trim()) {
      setHandle(inputHandle.trim());
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Codeforces Profile</h1>
      
      {/* Handle Input Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="handle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Codeforces Handle
            </label>
            <input
              type="text"
              id="handle"
              value={inputHandle}
              onChange={(e) => setInputHandle(e.target.value)}
              placeholder="Enter your Codeforces handle"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-end"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View Profile'}
          </button>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Profile Summary */}
      {loading ? (
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 w-full h-64 mb-6"></div>
      ) : (
        profileData && (
          <div className="space-y-6">
            <CodeforcesSummary userData={profileData} />
            
            {profileData.stats?.ratingHistory?.length > 0 && (
              <CodeforcesRatingChart ratingHistory={profileData.stats.ratingHistory} />
            )}
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Ready to Practice?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Check out our curated list of Codeforces problems organized by difficulty level.
              </p>
              <button
                onClick={() => router.push('/dashboard/codeforces/problems')}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View Problem Set
              </button>
            </div>
          </div>
        )
      )}
      
      {/* Prompt when no handle is entered */}
      {!loading && !profileData && !error && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Enter Your Codeforces Handle</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Enter your Codeforces handle above to view your profile statistics and performance analysis.
          </p>
          <div className="flex justify-center">
            <img 
              src="https://codeforces.org/s/0/android-icon-192x192.png" 
              alt="Codeforces Logo" 
              className="w-20 h-20 opacity-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}