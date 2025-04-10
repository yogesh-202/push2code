'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RadarChart from '@/components/RadarChart';
import HeatMap from '@/components/HeatMap';
import ProgressBar from '@/components/ProgressBar';

export default function Analytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState({
    topicPerformance: [],
    difficultyStats: {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    },
    timePerformance: {
      averageTime: 0,
      fastestSolve: { problem: '', time: 0 },
      slowestSolve: { problem: '', time: 0 }
    },
    criticalTopics: [],
    monthlyActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/user/critical-topics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Performance Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize your progress and identify areas for improvement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Topic Performance Radar */}
        <div className="dashboard-card">
          <h2 className="section-title">Topic Performance</h2>
          <div className="h-80">
            <RadarChart data={analytics.topicPerformance || []} />
          </div>
        </div>

        {/* Critical Topics Heatmap */}
        <div className="dashboard-card">
          <h2 className="section-title">Critical Topics Analysis</h2>
          <div className="h-80">
            <HeatMap data={analytics.criticalTopics || []} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Difficulty Distribution */}
        <div className="dashboard-card">
          <h2 className="section-title">Difficulty Distribution</h2>
          <div className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Easy</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {analytics.difficultyStats?.easy?.solved || 0}/{analytics.difficultyStats?.easy?.total || 0}
                </span>
              </div>
              <ProgressBar 
                percentage={analytics.difficultyStats?.easy?.total ? 
                  (analytics.difficultyStats.easy.solved / analytics.difficultyStats.easy.total) * 100 : 0} 
                color="green" 
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {analytics.difficultyStats?.medium?.solved || 0}/{analytics.difficultyStats?.medium?.total || 0}
                </span>
              </div>
              <ProgressBar 
                percentage={analytics.difficultyStats?.medium?.total ? 
                  (analytics.difficultyStats.medium.solved / analytics.difficultyStats.medium.total) * 100 : 0} 
                color="yellow" 
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hard</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {analytics.difficultyStats?.hard?.solved || 0}/{analytics.difficultyStats?.hard?.total || 0}
                </span>
              </div>
              <ProgressBar 
                percentage={analytics.difficultyStats?.hard?.total ? 
                  (analytics.difficultyStats.hard.solved / analytics.difficultyStats.hard.total) * 100 : 0} 
                color="red" 
              />
            </div>
          </div>
        </div>

        {/* Time Performance */}
        <div className="dashboard-card">
          <h2 className="section-title">Time Performance</h2>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Average solving time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.timePerformance?.averageTime || 0} minutes
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">Fastest solve</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {analytics.timePerformance?.fastestSolve?.time || 0} minutes
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {analytics.timePerformance?.fastestSolve?.problem || 'N/A'}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">Slowest solve</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {analytics.timePerformance?.slowestSolve?.time || 0} minutes
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {analytics.timePerformance?.slowestSolve?.problem || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Topics List */}
      <div className="dashboard-card mb-8">
        <h2 className="section-title">Critical Topics to Focus On</h2>
        {analytics.criticalTopics && analytics.criticalTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.criticalTopics.map((topic, index) => (
              <div key={index} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-red-500 dark:text-red-400 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{topic.name}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {topic.reason}
                </p>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Solved: {topic.solved}/{topic.total} problems ({Math.round((topic.solved / topic.total) * 100)}%)
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Average time: {topic.averageTime} minutes
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Not enough data to determine critical topics yet. Keep solving problems!
          </p>
        )}
      </div>

      {/* Monthly Activity */}
      <div className="dashboard-card">
        <h2 className="section-title">Monthly Problem Solving Activity</h2>
        <div className="grid grid-cols-12 gap-2 mt-4">
          {Array.from({ length: 30 }, (_, i) => {
            const dayInfo = analytics.monthlyActivity && analytics.monthlyActivity[i];
            const activityLevel = dayInfo && dayInfo.count
              ? dayInfo.count === 0
                ? 'bg-gray-100 dark:bg-gray-700'
                : dayInfo.count < 2
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : dayInfo.count < 4
                    ? 'bg-green-300 dark:bg-green-700'
                    : 'bg-green-500 dark:bg-green-500'
              : 'bg-gray-100 dark:bg-gray-700';
            
            return (
              <div
                key={i}
                className={`h-8 rounded-sm ${activityLevel} cursor-pointer transition-colors duration-200`}
                title={dayInfo ? `${dayInfo.date}: ${dayInfo.count} problem(s)` : `No activity`}
              />
            );
          })}
        </div>
        <div className="flex justify-end mt-2">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
            <span>Less</span>
            <div className="bg-gray-100 dark:bg-gray-700 w-3 h-3 rounded-sm"></div>
            <div className="bg-green-100 dark:bg-green-900/30 w-3 h-3 rounded-sm"></div>
            <div className="bg-green-300 dark:bg-green-700 w-3 h-3 rounded-sm"></div>
            <div className="bg-green-500 dark:bg-green-500 w-3 h-3 rounded-sm"></div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
