// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import ProblemCard from '@/components/ProblemCard';
// import ProgressBar from '@/components/ProgressBar';
// import DailyGoals from '@/components/DailyGoals';
// import ProgressChart from '@/components/ProgressChart';
// import RadarChart from '@/components/RadarChart';
// import HeatMap from '@/components/HeatMap';
// import StatsCard from '@/components/StatsCard';
// import { FireIcon } from '@heroicons/react/24/outline';
// import { toast } from 'react-hot-toast';

// const defaultStats = {
//   difficultyProgress: {
//     easy: { solved: 0, attempted: 0, total: 0 },
//     medium: { solved: 0, attempted: 0, total: 0 },
//     hard: { solved: 0, attempted: 0, total: 0 }
//   },
//   topicProgress: [],
//   totalSolved: 0,
//   totalAttempted: 0,
//   totalAvailable: 0,
//   accuracy: 0,
//   avgTimePerProblem: 0,
//   totalTimeSpent: 0,
//   streak: 0
// };


// export default function Dashboard() {
//   const router = useRouter();
//   const { status } = useSession();
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState(defaultStats);
//   const [dailyGoals, setDailyGoals] = useState([]);
//   const [backlogs, setBacklogs] = useState([]);
//   const [showBacklogs, setShowBacklogs] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [analytics, setAnalytics] = useState({
//     ...defaultStats,
//     recommendations: []
//   });
//   const [showYoutubeModal, setShowYoutubeModal] = useState(false);
//   const [currentYoutubeUrl, setCurrentYoutubeUrl] = useState('');

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/login');
//       return;
//     }
//     if (status === 'authenticated') {
//       fetchDashboardData();
//     }

//     // Listen for daily goals updates
//     const handleDailyGoalsUpdate = (event) => {
//       if (event.detail?.goals) {
//         setDailyGoals(event.detail.goals);
//       }
//     };

//     window.addEventListener('dailyGoalsUpdated', handleDailyGoalsUpdate);
//     return () => window.removeEventListener('dailyGoalsUpdated', handleDailyGoalsUpdate);
//   }, [status]);

//   const handleProblemClick = async (problem) => {
//     try {
//       // Open the problem link in a new tab
//       window.open(problem.url || problem.link, '_blank');
      
//       // If the problem is not solved, show the mark as solved modal
//       if (!problem.solved) {
//         // You can implement a modal here if needed
//         console.log('Problem not solved:', problem);
//       }
//     } catch (error) {
//       console.error('Error handling problem click:', error);
//       toast.error('Failed to open problem');
//     }
//   };
  
  

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [goalsRes, backlogsRes, statsRes] = await Promise.all([
//         fetch('/api/daily-goals', {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }),
//         fetch('/api/backlogs', {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }),
//         fetch('/api/user/stats', {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }),
//       ]);

//       if (!goalsRes.ok || !backlogsRes.ok || !statsRes.ok) {
//         throw new Error('Failed to load dashboard data');
//       }

//       const goalsData = await goalsRes.json();
//       const backlogsData = await backlogsRes.json();
//       const statsData = await statsRes.json();

//       // Ensure daily goals are properly formatted
//       const formattedDailyGoals = (goalsData.dailyGoals || []).map(goal => ({
//         ...goal,
//         url: goal.url || goal.link,
//         solved: goal.solved || false,
//         setToDailyGoal: true
//       }));

//       setDailyGoals(formattedDailyGoals);
//       setBacklogs(backlogsData.backlogProblems || []);
//       setStats(statsData || defaultStats);
//       setAnalytics({ ...statsData, recommendations: statsData.recommendations || [] });
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError(error.message);
//       setLoading(false);
//       toast.error('Failed to load dashboard data');
//     }
//   };

//   useEffect(() => {
//     // Listen for problem actions
//     const handleMarkRevision = (event) => {
//       if (event.detail?.problemId) {
//         handleMarkRevision(event.detail.problemId);
//       }
//     };

//     const handleToggleDailyGoal = (event) => {
//       if (event.detail?.problem) {
//         handleAddToDailyGoal(event.detail.problem);
//       }
//     };

//     const handleProblemSolved = () => {
//       fetchDashboardData();
//     };

//     window.addEventListener('markRevision', handleMarkRevision);
//     window.addEventListener('toggleDailyGoal', handleToggleDailyGoal);
//     window.addEventListener('problemSolved', handleProblemSolved);

//     return () => {
//       window.removeEventListener('markRevision', handleMarkRevision);
//       window.removeEventListener('toggleDailyGoal', handleToggleDailyGoal);
//       window.removeEventListener('problemSolved', handleProblemSolved);
//     };
//   }, []);

//   const handleMarkSolved = async (problem, timeSpent, selfRatedDifficulty) => {
//     try {
//       const response = await fetch('/api/problems/mark-solved', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           problemId: problem._id || problem.id,
//           timeSpent: parseInt(timeSpent),
//           selfRatedDifficulty: parseInt(selfRatedDifficulty)
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to mark problem as solved');
//       }

//       toast.success('Problem marked as solved!');
//       fetchDashboardData(); // Refresh all data
//       window.dispatchEvent(new Event('problemSolved'));
//     } catch (error) {
//       console.error('Error marking problem as solved:', error);
//       toast.error(error.message || 'Failed to mark as solved');
//     }
//   };

//   const handleMarkRevision = async (problemId) => {
//     try {
//       // Optimistic update for daily goals
//       setDailyGoals(prev => prev.map(p => 
//         (p._id === problemId || p.id === problemId) 
//           ? { ...p, setToRevision: !p.setToRevision }
//           : p
//       ));

//       // Optimistic update for backlogs
//       setBacklogs(prev => prev.map(p => 
//         (p._id === problemId || p.id === problemId) 
//           ? { ...p, setToRevision: !p.setToRevision }
//           : p
//       ));

//       const response = await fetch('/api/problems/mark-revision', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({ problemId })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update revision status');
//       }

//       const data = await response.json();
//       toast.success(data.message);
//       fetchDashboardData(); // Refresh all data

//     } catch (error) {
//       console.error('Error updating revision status:', error);
//       toast.error(error.message || 'Failed to update revision status');
//       // Revert optimistic updates on error
//       fetchDashboardData();
//     }
//   };

//   const handleAddToDailyGoal = async (problem) => {
//     try {
//       const problemId = problem._id || problem.id;

//       // Optimistic update
//       const isAddingToDaily = !problem.setToDailyGoal;
//       setDailyGoals(prev => {
//         if (isAddingToDaily) {
//           return [...prev, { ...problem, setToDailyGoal: true }];
//         }
//         return prev.filter(p => (p._id || p.id) !== problemId);
//       });

//       const response = await fetch('/api/daily-goals', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({ problemId })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update daily goal status');
//       }

//       toast.success(data.message);
//       fetchDashboardData(); // Refresh all data

//     } catch (error) {
//       console.error('Error updating daily goal status:', error);
//       toast.error(error.message || 'Failed to update daily goal status');
//       fetchDashboardData(); // Revert optimistic update
//     }
//   };

//   const handleOpenYoutubeVideo = (url) => {
//     setCurrentYoutubeUrl(url);
//     setShowYoutubeModal(true);
//   };

//   const handleCloseYoutubeModal = () => {
//     setCurrentYoutubeUrl('');
//     setShowYoutubeModal(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
//           <p>{error}</p>
//         </div>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="btn-primary"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Welcome back, {user?.username || 'User'}
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">
//           Here's your progress overview and recommendations
//         </p>
//       </div>

//       {/* Stats Overview */}
//       <div className="stats-section">
//         {error ? (
//           <div className="error-message">
//             {error}
//             <button onClick={fetchDashboardData}>Retry</button>
//           </div>
//         ) : loading ? (
//           <div className="loading">Loading stats...</div>
//         ) : (
//           <>
//             <div className="stats-overview grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
//               <StatsCard
//                 title="Total Solved"
//                 value={stats.totalSolved}
//                 total={stats.totalAvailable}
//               />
//               <StatsCard
//                 title="Current Streak"
//                 value={`${stats.streak} days`}
//                 icon={<FireIcon className="h-6 w-6" />}
//               />
//               <StatsCard
//                 title="Average Time"
//                 value={`${Math.round(stats.avgTimePerProblem)} min`}
//               />
//               <StatsCard
//                 title="Accuracy"
//                 value={`${stats.accuracy}%`}
//               />
//             </div>


// {/* Daily Goals Section */}
//       <DailyGoals goals={dailyGoals} onProblemClick={handleProblemClick} />

//       {/* Backlogs Section */}
//       <div className="mb-8">
//         <button
//           onClick={() => setShowBacklogs(!showBacklogs)}
//           className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
//         >
//           <div className="flex items-center space-x-3">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Backlogs</h2>
//             <div className="flex items-center space-x-2">
//               <span className="px-2.5 py-0.5 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
//                 {backlogs.length}
//               </span>
//               <span className="px-2.5 py-0.5 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
//                 {backlogs.filter(p => p.solved).length} solved
//               </span>
//             </div>
//           </div>
//           <svg
//             className={`w-6 h-6 transform transition-transform duration-200 ${
//               showBacklogs ? 'rotate-180' : ''
//             }`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>
        
//         {showBacklogs && (
//           <div className="mt-4 space-y-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
//             {backlogs.length > 0 ? (
//               backlogs.map((backlog) => (
//                 <ProblemCard
//                   key={backlog._id || backlog.id}
//                   problem={{
//                     ...backlog,
//                     _id: backlog._id || backlog.id,
//                     title: backlog.title,
//                     difficulty: backlog.difficulty,
//                     acceptance: backlog.acceptance || 'N/A',
//                     isSolved: backlog.solved || false,
//                     setToRevision: backlog.setToRevision || false,
//                     setToDailyGoal: backlog.setToDailyGoal || false,
//                     youtubeLink: backlog.youtubeLink,
//                     tags: backlog.tags || [],
//                     url: backlog.url || backlog.link,
//                     isBacklog: true,
//                     originalDate: backlog.dailyGoalAssignedDate
//                   }}
//                   onClick={() => handleProblemClick(backlog)}
//                   onMarkSolved={() => handleProblemClick(backlog)}
//                   onMarkRevision={(id) => handleMarkRevision(id)}
//                   onAddToDailyGoal={(problem) => handleAddToDailyGoal(problem)}
//                   lockStatus={{ isLocked: false }}
//                   onOpenYoutube={handleOpenYoutubeVideo}
//                 />
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <p className="mt-4 text-gray-600 dark:text-gray-400">
//                   No backlog problems. Keep up the good work!
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
          

//             {/* Difficulty Distribution */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 mt-8">
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Difficulty Distribution</h2>
//                 <div className="space-y-6">
//                   {Object.entries(stats.difficultyProgress).map(([level, stats]) => (
//                     <div key={level}>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
//                           {level}
//                         </span>
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                           {stats.solved}/{stats.total}
//                         </span>
//                       </div>
//                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                         <div
//                           className={`h-2.5 rounded-full ${
//                             level === 'easy' ? 'bg-green-500' :
//                             level === 'medium' ? 'bg-yellow-500' :
//                             'bg-red-500'
//                           }`}
//                           style={{ width: `${(stats.solved / stats.total) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Topic Progress */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-3">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progress by Topic</h2>
//                 <div className="space-y-4">
//                   {stats.topicProgress && stats.topicProgress.map((topic) => (
//                     <div key={topic.name}>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{topic.name}</span>
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                           {topic.solved}/{topic.total} ({Math.round((topic.solved / topic.total) * 100)}%)
//                         </span>
//                       </div>
//                       <ProgressBar 
//                         percentage={(topic.solved / topic.total) * 100} 
//                         color={
//                           topic.solved / topic.total < 0.3 ? 'red' : 
//                           topic.solved / topic.total < 0.7 ? 'yellow' : 'green'
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* YouTube Video Modal */}
//       {showYoutubeModal && currentYoutubeUrl && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
//           <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl h-[70vh] flex flex-col">
//             <button
//               onClick={handleCloseYoutubeModal}
//               className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold z-10"
//             >
//               &times;
//             </button>
//             <div className="relative pt-[56.25%] w-full h-full">
//               <iframe
//                 className="absolute top-0 left-0 w-full h-full rounded-b-lg"
//                 src={`${currentYoutubeUrl.replace('watch?v=', 'embed/')}?autoplay=1`}
//                 title="YouTube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }