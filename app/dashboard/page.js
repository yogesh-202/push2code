'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProblemCard from '@/components/ProblemCard';
import ProgressBar from '@/components/ProgressBar';
import DailyGoals from '@/components/DailyGoals';
import ProgressChart from '@/components/ProgressChart';
import RadarChart from '@/components/RadarChart';
import HeatMap from '@/components/HeatMap';
import StatsCard from '@/components/StatsCard';
import { FireIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    overview: {
      totalProblems: 0,
      solvedProblems: 0,
      averageTime: 0,
      streak: 0,
      accuracy: 0
    },
    performance: {
      daily: [],
      weekly: [],
      monthly: []
    },
    topics: {
      distribution: [],
      performance: [],
      weaknesses: []
    },
    difficulty: {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    },
    timeAnalysis: {
      averageByDifficulty: {},
      bestTime: { problem: '', time: 0 },
      worstTime: { problem: '', time: 0 }
    }
  });
  const [dailyGoals, setDailyGoals] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [showBacklogs, setShowBacklogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalProblems: 0,
      solvedProblems: 0,
      averageTime: 0,
      streak: 0,
      accuracy: 0
    },
    performance: {
      daily: [],
      weekly: [],
      monthly: []
    },
    topics: {
      distribution: [],
      performance: [],
      weaknesses: []
    },
    difficulty: {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    },
    timeAnalysis: {
      averageByDifficulty: {},
      bestTime: { problem: '', time: 0 },
      worstTime: { problem: '', time: 0 }
    },
    recommendations: []
  });

  const fetchAnalytics = async (token) => {
    try {
      if (!token) {
        console.log('No token found, skipping analytics fetch');
        return;
      }

      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Analytics fetch failed:', response.status);
        // Don't set error state for background refreshes
        if (!isLoading) {
          setError('Unable to refresh analytics data');
        }
        return;
      }

      const data = await response.json();
      setAnalytics(data);
      // Clear any existing error when fetch succeeds
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Don't set error state for background refreshes
      if (!isLoading) {
        setError('Unable to refresh analytics data');
      }
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user data
      const userResponse = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();
      setUser(userData);
      
      // Fetch analytics
      await fetchAnalytics(token);

      // Fetch daily goals
      const goalsResponse = await fetch('/api/daily-goals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!goalsResponse.ok) {
        throw new Error('Failed to fetch daily goals');
      }
      
      const goalsData = await goalsResponse.json();
      setDailyGoals(goalsData.dailyGoals || []);
      
      // Fetch backlogs
      const backlogsResponse = await fetch('/api/backlogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!backlogsResponse.ok) {
        throw new Error('Failed to fetch backlogs');
      }
      
      const backlogsData = await backlogsResponse.json();
      setBacklogs(backlogsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAnalytics(token),
          fetchDashboardData()
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up auto-refresh for analytics every minute
    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        fetchAnalytics(currentToken).catch(err => {
          console.error('Background refresh failed:', err);
          // Don't update UI for background refresh errors
        });
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Event listener for problem solved
  useEffect(() => {
    const handleProblemSolved = () => {
      fetchAnalytics(localStorage.getItem('token'));
    };

    window.addEventListener('problemSolved', handleProblemSolved);
    return () => window.removeEventListener('problemSolved', handleProblemSolved);
  }, []);

  const handleProblemClick = (problem) => {
    window.open(problem.url || problem.link, '_blank');
  };

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username || 'User'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your progress overview and recommendations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-section">
        {error ? (
          <div className="error-message">
            {error}
            <button onClick={fetchAnalytics}>Retry</button>
          </div>
        ) : loading ? (
          <div className="loading">Loading stats...</div>
        ) : (
          <>
            <div className="stats-overview grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <StatsCard
                title="Total Solved"
                value={analytics.overview.solvedProblems}
                total={analytics.overview.totalProblems}
              />
              <StatsCard
                title="Current Streak"
                value={`${analytics.overview.streak} days`}
                icon={<FireIcon className="h-6 w-6" />}
              />
              <StatsCard
                title="Average Time"
                value={`${Math.round(analytics.overview.averageTime)} min`}
              />
              <StatsCard
                title="Accuracy"
                value={`${analytics.overview.accuracy}%`}
              />
            </div>


{/* Daily Goals Section */}
      <DailyGoals goals={dailyGoals} onProblemClick={handleProblemClick} />

      {/* Backlogs Section */}
      <div className="mb-8">
        <button
          onClick={() => setShowBacklogs(!showBacklogs)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Backlogs</h2>
            <span className="px-2.5 py-0.5 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
              {backlogs.length}
            </span>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform duration-200 ${
              showBacklogs ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {showBacklogs && (
          <div className="mt-4">
            {backlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {backlogs.map((backlog) => (
                  <ProblemCard
                    key={backlog.id}
                    problem={{
                      ...backlog,
                      url: backlog.url || backlog.link,
                      isBacklog: true,
                      originalDate: new Date(backlog.originalDate).toLocaleDateString()
                    }}
                    onClick={() => handleProblemClick(backlog)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 p-4 bg-white dark:bg-gray-800 rounded-lg">
                No backlogs yet. Keep up the good work!
              </p>
            )}
          </div>
        )}
      </div>
          

            {/* Difficulty Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Difficulty Distribution</h2>
                <div className="space-y-6">
                  {Object.entries(analytics.difficulty).map(([level, stats]) => (
                    <div key={level}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {level}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {stats.solved}/{stats.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            level === 'easy' ? 'bg-green-500' :
                            level === 'medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(stats.solved / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Time Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Time per Problem</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(analytics.overview.averageTime)} mins
                    </p>
                  </div>
                  {analytics.timeAnalysis && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Time</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {analytics.timeAnalysis.bestTime.problem} ({Math.round(analytics.timeAnalysis.bestTime.time)} mins)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Worst Time</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {analytics.timeAnalysis.worstTime.problem} ({Math.round(analytics.timeAnalysis.worstTime.time)} mins)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Topic Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="dashboard-card lg:col-span-3">
                <h2 className="section-title">Progress by Topic</h2>
                <div className="space-y-4">
                  {analytics.topics.distribution && analytics.topics.distribution.map((topic) => (
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
            </div>
          </>
        )}
      </div>

      
 
   {/* Recommendations Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.recommendations && analytics.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {recommendation.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {recommendation.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>



    </div>
  );
}