'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaBookmark, FaYoutube, FaExternalLinkSquareAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProblemCard({ problem, onMarkSolved, onMarkRevision, onAddToDailyGoal, lockStatus, isRevisionPage = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [timeSpent, setTimeSpent] = useState('');
  const [selfDifficulty, setSelfDifficulty] = useState('');

  if (!problem || status === 'loading') return null;
  if (!session) {
    router.push('/login');
    return null;
  }

  const { _id, id, title, difficulty, acceptance, isSolved: solved, isBacklog, originalDate, setToRevision: markedForRevision, setToDailyGoal: addedToDailyGoal, youtubeLink } = problem;
  const problemId = _id || id;
  const problemLink = problem.url || problem.link;

  const difficultyMap = {
    'Easy': 1,
    'Medium': 3,
    'Hard': 5
  };

  const handleMarkSolved = async () => {
    if (!timeSpent || !selfDifficulty) {
      toast.error('Please fill in all fields');
      return;
    }

    const parsedTimeSpent = parseInt(timeSpent);
    if (isNaN(parsedTimeSpent) || parsedTimeSpent <= 0) {
      toast.error('Please enter a valid time spent (greater than 0)');
      return;
    }

    const numericDifficulty = difficultyMap[selfDifficulty];
    if (!numericDifficulty) {
      toast.error('Please select a valid difficulty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/problems/mark-solved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          problemId,
          timeSpent: parsedTimeSpent,
          selfRatedDifficulty: numericDifficulty,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark problem as solved');
      }

      if (onMarkSolved) onMarkSolved(problemId);

      setShowModal(false);
      toast.success('Problem marked as solved!');
      window.dispatchEvent(new Event('problemSolved'));
    } catch (error) {
      console.error('Error marking problem as solved:', error);
      toast.error(error.message || 'Failed to mark problem as solved');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkForRevision = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/problems/mark-revision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ problemId }),
      });

      if (!response.ok) throw new Error('Failed to update revision status');

      if (onMarkRevision) onMarkRevision(problemId);

      toast.success(markedForRevision ? 'Removed from revision list' : 'Added to revision list');
    } catch (error) {
      console.error('Error updating revision status:', error);
      toast.error(error.message || 'Failed to update revision status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToDailyGoal = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ problemId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update daily goal status');
      }

      if (onAddToDailyGoal) onAddToDailyGoal(problem);

      toast.success(data.message || 'Daily goal updated successfully');
    } catch (error) {
      console.error('Error updating daily goal:', error);
      toast.error(error.message || 'Failed to update daily goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisitProblem = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (lockStatus?.isLocked) {
      toast.error('Complete revision and backlog problems to unlock new problems');
      return;
    }

    if (problemLink) {
      window.open(problemLink, '_blank');
    } else {
      toast.error('Problem link not available');
    }
  };

  const handleYoutubeClick = (e) => {
    e.stopPropagation();
    if (youtubeLink) {
      setShowYoutubeModal(true);
    } else {
      toast.error('No YouTube link available for this problem');
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Title and Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            {/* Title */}
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            {/* Difficulty Badge */}
            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {difficulty}
            </span>
           
          </div>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Visit Problem Button */}
          <button
            onClick={handleVisitProblem}
            className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-md transition-colors duration-200 flex items-center gap-1"
            title="Visit Problem"
          >
            <FaExternalLinkSquareAlt className="w-3.5 h-3.5" />
            <span>Visit</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            disabled={isLoading || solved}
            className={`p-1.5 rounded-md ${
              solved
                ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            } transition-colors duration-200`}
            title={solved ? 'Solved' : 'Mark as solved'}
          >
            <FaCheck className="w-4 h-4" />
          </button>

          <button
            onClick={handleMarkForRevision}
            disabled={isLoading}
            className={`p-1.5 rounded-md ${
              markedForRevision
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            } transition-colors duration-200`}
            title={markedForRevision ? 'Remove from revision' : 'Add to revision'}
          >
            <FaBookmark className="w-4 h-4" />
          </button>

          <button
            onClick={handleAddToDailyGoal}
            disabled={isLoading}
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              addedToDailyGoal
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            } transition-colors duration-200`}
            title={addedToDailyGoal ? 'Remove from daily goals' : 'Add to daily goals'}
          >
            {addedToDailyGoal ? 'Remove Goal' : 'Add Goal'}
          </button>

          {youtubeLink && (
            <button
              onClick={handleYoutubeClick}
              className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40 transition-colors duration-200"
              title="Watch YouTube Tutorial"
            >
              <FaYoutube className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={e => e.stopPropagation()}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Mark Problem as Solved</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time Spent (minutes)
                </label>
                <input
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Self-Rated Difficulty
                </label>
                <select
                  value={selfDifficulty}
                  onChange={(e) => setSelfDifficulty(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkSolved}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {isLoading ? 'Marking...' : 'Mark as Solved'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showYoutubeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={e => e.stopPropagation()}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Video Tutorial</h3>
              <button
                onClick={() => setShowYoutubeModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${youtubeLink.split('v=')[1]}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {lockStatus?.isSunday && lockStatus?.isLocked && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900/50 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Sunday is revision day! Complete your revision and backlog problems to unlock new problems.
          </p>
          {lockStatus && (
            <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
              <p>Revision Problems: {lockStatus.solvedRevisionCount}/{lockStatus.revisionCount} solved</p>
              <p>Backlog Problems: {lockStatus.solvedBacklogCount}/{lockStatus.backlogCount} solved</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}