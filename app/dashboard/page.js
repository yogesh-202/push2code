'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProblemCard from '@/components/ProblemCard';
import ProgressBar from '@/components/ProgressBar';
import StatsCard from '@/components/StatsCard';
import { FireIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';


const defaultStats = {
  difficultyProgress: {
    easy: { solved: 0, attempted: 0, total: 0 },
    medium: { solved: 0, attempted: 0, total: 0 },
    hard: { solved: 0, attempted: 0, total: 0 }
  },
  topicProgress: [],
  totalSolved: 0,
  totalAttempted: 0,
  totalAvailable: 0,
  accuracy: 0,
  avgTimePerProblem: 0,
  totalTimeSpent: 0,
  streak: 0
};

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState(defaultStats);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [showBacklogs, setShowBacklogs] = useState(false);
  const [showDailyGoals, setShowDailyGoals] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetchDashboardData();
    }

    // Listen for updates from ProblemCard actions
    const handleProblemUpdate = () => {
      fetchDashboardData();
    };

    window.addEventListener('problemSolved', handleProblemUpdate);
    window.addEventListener('dailyGoalsUpdated', handleProblemUpdate);
    window.addEventListener('problemStatusChanged', handleProblemUpdate);

    return () => {
      window.removeEventListener('problemSolved', handleProblemUpdate);
      window.removeEventListener('dailyGoalsUpdated', handleProblemUpdate);
      window.removeEventListener('problemStatusChanged', handleProblemUpdate);
    };
  }, [status]);

  const fetchDashboardData = async () => {
    try {  
      setLoading(true);
      const [goalsRes, backlogsRes, statsRes] = await Promise.all([
        fetch('/api/daily-goals', { credentials: 'include' }),
        fetch('/api/backlogs', { credentials: 'include' }),
        fetch('/api/user/stats', { credentials: 'include' })
      ]);

      if (!goalsRes.ok || !backlogsRes.ok || !statsRes.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const [goalsData, backlogsData, statsData] = await Promise.all([
        goalsRes.json(),
        backlogsRes.json(),
        statsRes.json()
      ]);

      
      // Format problems to ensure all required properties are present
      const formatProblem = (problem) => ({
        ...problem,
        _id: problem._id || problem.id,
        isSolved: problem.solved || false,
        setToRevision: problem.setToRevision || false,
        setToDailyGoal: true, // For daily goals
        link: problem.url || problem.link,
        tags: problem.tags || [],
        acceptance: problem.acceptance || 'N/A'
      });


      setDailyGoals(goalsData.dailyGoals?.map(formatProblem) || []);
      setBacklogs(backlogsData.backlogProblems?.map(formatProblem) || []);
      setStats(statsData || defaultStats);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      setLoading(false);
      toast.error('Failed to load dashboard data');
    }
  };

  if (status==='loading' || loading ) {
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
          onClick={fetchDashboardData} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="stats-overview grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <StatsCard
          title="Total Solved"
          value={stats.totalSolved}
          total={stats.totalAvailable}
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.streak} days`}
          icon={<FireIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Average Time"
          value={`${stats.avgTimePerProblem} min`}
        />
        <StatsCard
          title="Accuracy"
          value={`${stats.accuracy}%`}
        />
      </div>

      {/* Daily Goals Section */}
      <div className="mb-8">
        <button
          onClick={() => setShowDailyGoals(!showDailyGoals)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Goals</h2>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                {dailyGoals.length}
              </span>
              <span className="px-2.5 py-0.5 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                {dailyGoals.filter(p => p.isSolved).length} solved
              </span>
            </div>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform duration-200 ${showDailyGoals ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDailyGoals && (
          <div className="mt-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            {dailyGoals.length > 0 ? (
              dailyGoals.map((problem) => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  onMarkSolved={fetchDashboardData}
                  onMarkRevision={fetchDashboardData}
                  onAddToDailyGoal={fetchDashboardData}
                  lockStatus={{ isLocked: false }}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No daily goals set. Visit the problems page to add some!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Backlogs Section */}
      <div className="mb-8">
        <button
          onClick={() => setShowBacklogs(!showBacklogs)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Backlogs</h2>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                {backlogs.length}
              </span>
              <span className="px-2.5 py-0.5 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                {backlogs.filter(p => p.isSolved).length} solved
              </span>
            </div>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform duration-200 ${showBacklogs ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showBacklogs && (
          <div className="mt-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            {backlogs.length > 0 ? (
              backlogs.map((problem) => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  onMarkSolved={fetchDashboardData}
                  onMarkRevision={fetchDashboardData}
                  onAddToDailyGoal={fetchDashboardData}
                  lockStatus={{ isLocked: false }}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No backlog problems. Keep up the good work!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Difficulty Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Difficulty Distribution</h2>
          <div className="space-y-6">
            {Object.entries(stats.difficultyProgress).map(([level, stats]) => (
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

        {/* Topic Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progress by Topic</h2>
          <div className="space-y-4">
           {stats.topicProgress?.map((topic, idx) => (
  <div key={topic.topic ? `${topic.topic}-${idx}` : idx}>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{topic.topic}</span>
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
    </div>
  );
}