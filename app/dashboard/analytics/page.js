'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import HeatMap from '@/components/HeatMap';
import RadarChart from '@/components/RadarChart';

export default function Analytics() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchStats(token);
  }, [router]);
  
  const fetchStats = async (token) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare data for Radar Chart
  const prepareRadarData = () => {
    if (!stats?.topicStats) return null;
    
    const topicData = stats.topicStats.slice(0, 6).map(topic => ({
      topic: topic.topic,
      completionRate: topic.completionPercentage / 100
    }));
    
    return {
      labels: topicData.map(item => item.topic),
      datasets: [
        {
          label: 'Completion Rate',
          data: topicData.map(item => item.completionRate)
        }
      ]
    };
  };
  
  // Prepare data for Heat Map
  const prepareHeatMapData = () => {
    // In a real app, this would come from actual data
    // For demo, we'll create simulated data
    if (!stats) return [];
    
    const days = 120; // Show last 4 months
    const today = new Date();
    const data = [];
    
    // Create activity data for the last 120 days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // More activity for recent days, less for older days
      // Just for demonstration
      const randomValue = i < 7 
        ? Math.floor(Math.random() * 3) + 1 
        : i < 30 
          ? Math.random() > 0.6 ? Math.floor(Math.random() * 3) : 0
          : Math.random() > 0.8 ? 1 : 0;
      
      if (randomValue > 0) {
        data.push({
          date: date.toISOString().split('T')[0],
          count: randomValue
        });
      }
    }
    
    return data;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress and identify areas for improvement
          </p>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
              ))}
            </div>
            <div className="h-80 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg">
            <p>Error: {error}</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Total Problems Solved
                </h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats?.summary?.totalSolved || 0}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                    /{stats?.summary?.totalProblems || 0}
                  </span>
                </p>
                <div className="mt-3">
                  <ProgressBar 
                    percentage={stats?.summary?.completionPercentage || 0} 
                    color="bg-indigo-600"
                  />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Avg. Time per Problem
                </h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats?.summary?.avgTimeSpent || 0}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                    min
                  </span>
                </p>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Based on your solved problems
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Current Streak
                </h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats?.summary?.streak || 0}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                    days
                  </span>
                </p>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Keep it going! Solve problems daily.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Difficulty Breakdown
                </h2>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-green-600 dark:text-green-400">Easy</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {stats?.difficultyStats?.easy?.solved || 0}/{stats?.difficultyStats?.easy?.total || 0}
                      </span>
                    </div>
                    <ProgressBar 
                      percentage={
                        stats?.difficultyStats?.easy?.total 
                          ? Math.round((stats.difficultyStats.easy.solved / stats.difficultyStats.easy.total) * 100) 
                          : 0
                      } 
                      color="bg-green-500"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-yellow-600 dark:text-yellow-400">Medium</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {stats?.difficultyStats?.medium?.solved || 0}/{stats?.difficultyStats?.medium?.total || 0}
                      </span>
                    </div>
                    <ProgressBar 
                      percentage={
                        stats?.difficultyStats?.medium?.total 
                          ? Math.round((stats.difficultyStats.medium.solved / stats.difficultyStats.medium.total) * 100) 
                          : 0
                      } 
                      color="bg-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-red-600 dark:text-red-400">Hard</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {stats?.difficultyStats?.hard?.solved || 0}/{stats?.difficultyStats?.hard?.total || 0}
                      </span>
                    </div>
                    <ProgressBar 
                      percentage={
                        stats?.difficultyStats?.hard?.total 
                          ? Math.round((stats.difficultyStats.hard.solved / stats.difficultyStats.hard.total) * 100) 
                          : 0
                      } 
                      color="bg-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Heat Map */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Activity Calendar
              </h2>
              <div className="h-48">
                <HeatMap data={prepareHeatMapData()} />
              </div>
            </div>
            
            {/* Topic Analysis and Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Topic Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Topic Analysis
                </h2>
                
                {stats?.topicStats && stats.topicStats.length > 0 ? (
                  <div className="h-64">
                    <RadarChart data={prepareRadarData()} />
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    Solve more problems to see topic analysis.
                  </p>
                )}
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Recent Activity
                </h2>
                
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="py-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            activity.difficulty === 'easy' ? 'bg-green-500' :
                            activity.difficulty === 'hard' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <p className="text-gray-800 dark:text-white font-medium">
                            {activity.title}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                          {new Date(activity.solvedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent activity. Start solving problems!
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}