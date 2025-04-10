'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TopicwiseProblemSheet from '@/components/TopicwiseProblemSheet';
import WeeklyRevisionSheet from '@/components/WeeklyRevisionSheet';
import CriticalUnsolvedProblems from '@/components/CriticalUnsolvedProblems';

export default function Problems() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('topic-wise');
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'topic-wise':
        return <TopicwiseProblemSheet />;
      case 'weekly-revision':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Weekly Revision Problems
            </h2>
            <WeeklyRevisionSheet />
          </div>
        );
      case 'critical-unsolved':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Critical Unsolved Problems
            </h2>
            <CriticalUnsolvedProblems />
          </div>
        );
      default:
        return <TopicwiseProblemSheet />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Problem Sheets
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your DSA practice with structured problem sheets
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'topic-wise'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('topic-wise')}
            >
              Topic-wise Problems
            </button>
            
            <button
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'weekly-revision'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('weekly-revision')}
            >
              Weekly Revision
            </button>
            
            <button
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'critical-unsolved'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('critical-unsolved')}
            >
              Critical Unsolved
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </main>
    </div>
  );
}