'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProgressChart from '@/components/ProgressChart';
import ProgressBar from '@/components/ProgressBar';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    timeSpent: 0,
    topicProgress: [],
    recentlySolved: []
  });
  const [criticalTopics, setCriticalTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Fetch user stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch critical topics
    const fetchCriticalTopics = async () => {
      try {
        const response = await fetch('/api/user/critical-topics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch critical topics');
        }

        const data = await response.json();
        setCriticalTopics(data.criticalTopics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchCriticalTopics();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username || 'User'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your progress overview and recommendations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">Problems Solved</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalSolved}</p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">Total Time Spent</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {Math.floor(stats.timeSpent / 60)} hrs {stats.timeSpent % 60} mins
          </p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">Difficulty Distribution</h3>
          <div className="flex gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-difficulty-easy">
              Easy: {stats.easyCount}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-difficulty-medium">
              Medium: {stats.mediumCount}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-difficulty-hard">
              Hard: {stats.hardCount}
            </span>
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">Consistency</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.streak || 0} days
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current streak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Progress By Topic */}
        <div className="dashboard-card lg:col-span-2">
          <h2 className="section-title">Progress by Topic</h2>
          <div className="space-y-4">
            {stats.topicProgress && stats.topicProgress.map((topic) => (
              <div key={topic.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{topic.name}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {topic.solved}/{topic.total} ({Math.round((topic.solved / topic.total) * 100)}%)
                  </span>
                </div>
                <ProgressBar 
                  percentage={(topic.solved / topic.total) * 100} 
                  color={
                    topic.solved / topic.total < 0.3 ? 'red' : 
                    topic.solved / topic.total < 0.7 ? 'yellow' : 'green'
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Critical Topics */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Critical Topics</h2>
            <Link href="/dashboard/analytics" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View detailed analysis →
            </Link>
          </div>
          <div className="space-y-3">
            {criticalTopics.length > 0 ? (
              criticalTopics.map((topic, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex-shrink-0 text-red-500 dark:text-red-400 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{topic.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {topic.reason}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Not enough data to determine critical topics yet. Keep solving problems!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overall Progress Chart */}
        <div className="dashboard-card lg:col-span-2">
          <h2 className="section-title">Overall Progress</h2>
          <div className="h-64">
            <ProgressChart />
          </div>
        </div>

        {/* Recently Solved */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Recently Solved</h2>
            <Link href="/dashboard/problems" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View all problems →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentlySolved && stats.recentlySolved.length > 0 ? (
              stats.recentlySolved.map((problem) => (
                <div key={problem.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className={`flex-shrink-0 mr-3 w-2 h-2 rounded-full bg-difficulty-${problem.difficulty.toLowerCase()}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {problem.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {problem.topic} • {new Date(problem.solvedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {problem.timeSpent} mins
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You haven't solved any problems yet. Start practicing!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard/problems">
          <button className="btn-primary w-full sm:w-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Practice Problems
          </button>
        </Link>
        <Link href="/dashboard/analytics">
          <button className="btn-secondary w-full sm:w-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            View Analytics
          </button>
        </Link>
      </div>
    </div>
  );
}
