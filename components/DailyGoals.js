// 'use client';

// import { useState, useEffect } from 'react';
// import ProblemCard from './ProblemCard';
// import SolvedModal from './SolvedModal';
// import toast from 'react-hot-toast';

// export default function DailyGoals({ goals, onProblemClick }) {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showSolvedModal, setShowSolvedModal] = useState(false);
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const completedGoals = goals.filter(goal => goal.solved).length;

//   const refreshGoals = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch('/api/daily-goals', {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to refresh daily goals');
//       }

//       const data = await response.json();
//       if (data.dailyGoals) {
//         // Notify parent component to update goals
//         window.dispatchEvent(new CustomEvent('dailyGoalsUpdated', { 
//           detail: { goals: data.dailyGoals }
//         }));
//       }
//     } catch (err) {
//       console.error('Error refreshing daily goals:', err);
//       setError(err.message);
//       toast.error('Failed to refresh daily goals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkSolved = async (problem, timeSpent, selfRatedDifficulty) => {
//     try {
//       setLoading(true);
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
//       refreshGoals();
//       window.dispatchEvent(new Event('problemSolved'));
//       setShowSolvedModal(false);
//       setSelectedProblem(null);
//     } catch (error) {
//       console.error('Error marking problem as solved:', error);
//       toast.error(error.message || 'Failed to mark as solved');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkRevision = async (problemId) => {
//     try {
//       setLoading(true);
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
//       refreshGoals();

//     } catch (error) {
//       console.error('Error updating revision status:', error);
//       toast.error(error.message || 'Failed to update revision status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemoveFromDailyGoal = async (problem) => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/daily-goals', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({ 
//           problemId: problem._id || problem.id
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to remove from daily goals');
//       }

//       toast.success('Removed from daily goals');
//       refreshGoals();
//     } catch (error) {
//       console.error('Error removing from daily goals:', error);
//       toast.error(error.message || 'Failed to remove from daily goals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Listen for problem solved event
//     const handleProblemSolved = () => {
//       refreshGoals();
//     };

//     window.addEventListener('problemSolved', handleProblemSolved);
//     return () => window.removeEventListener('problemSolved', handleProblemSolved);
//   }, []);

//   return (
//     <div className="mb-8">      <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
//       >
//         <div className="flex items-center space-x-3">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Goals</h2>
//           <div className="flex items-center space-x-2">
//             <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
//               {completedGoals}/{goals.length} completed
//             </span>
//             {loading && (
//               <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300 rounded-full">
//                 Refreshing...
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               refreshGoals();
//             }}
//             className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             title="Refresh daily goals"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//             </svg>
//           </button>
//           <svg
//             className={`w-6 h-6 transform transition-transform duration-200 ${
//               isExpanded ? 'rotate-180' : ''
//             }`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </div>
//       </button>

//       {error && (
//         <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
//           {error}
//           <button
//             onClick={refreshGoals}
//             className="ml-2 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
//           >
//             Try Again
//           </button>
//         </div>
//       )}

//       {isExpanded && (
//         <div className="mt-4">
//           {goals.length > 0 ? (
//             <div className="space-y-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">              {goals.map((goal) => (                <ProblemCard
//                   key={goal.id}
//                   problem={{
//                     ...goal,
//                     _id: goal._id || goal.id,
//                     title: goal.title,
//                     difficulty: goal.difficulty,
//                     acceptance: goal.acceptance || 'N/A',
//                     isSolved: goal.solved,
//                     setToRevision: goal.setToRevision || false,
//                     setToDailyGoal: true,
//                     youtubeLink: goal.youtubeLink,
//                     tags: goal.tags || [],
//                     url: goal.url || goal.link,
//                   }}
//                   onClick={(problem) => {
//                     // Open problem in new tab
//                     window.open(problem.url || problem.link, '_blank');
//                     // If not solved, show solved modal
//                     if (!problem.solved) {
//                       setSelectedProblem(problem);
//                       setShowSolvedModal(true);
//                     }
//                   }}
//                   onMarkSolved={(id) => {
//                     const problem = goals.find(g => (g._id || g.id) === id);
//                     if (problem) {
//                       setSelectedProblem(problem);
//                       setShowSolvedModal(true);
//                     }
//                   }}
//                   onMarkRevision={handleMarkRevision}
//                   onAddToDailyGoal={handleRemoveFromDailyGoal}
//                   lockStatus={{ isLocked: false }}
//                   onOpenYoutube={(url) => {
//                     if (url) window.open(url, '_blank');
//                   }}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <p className="mt-4 text-gray-600 dark:text-gray-400">
//                 No daily goals set yet. Start adding problems to your daily goals!
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {showSolvedModal && selectedProblem && (
//         <SolvedModal
//           problem={selectedProblem}
//           onClose={() => {
//             setShowSolvedModal(false);
//             setSelectedProblem(null);
//           }}
//           onSubmit={(timeSpent, selfRatedDifficulty) => {
//             handleMarkSolved(selectedProblem, timeSpent, selfRatedDifficulty);
//           }}
//         />
//       )}
//     </div>
//   );
// }

