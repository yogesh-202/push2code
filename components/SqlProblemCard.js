import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaCheck, FaBookmark, FaExternalLinkAlt, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import YouTubeModal from './YouTubeModal';

export default function SqlProblemCard({ problem, onMarkSolved, onMarkForRevision }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [timeSpent, setTimeSpent] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(problem.markedForRevision || false);

  const difficultyMap = {
    'Easy': 1,
    'Medium': 3,
    'Hard': 5
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleMarkSolved = async () => {
    if (!timeSpent || !difficulty) {
      toast.error('Please fill in all fields');
      return;
    }

    const parsedTimeSpent = parseInt(timeSpent);
    if (isNaN(parsedTimeSpent) || parsedTimeSpent <= 0) {
      toast.error('Please enter a valid time spent (greater than 0)');
      return;
    }

    const numericDifficulty = difficultyMap[difficulty];
    if (!numericDifficulty) {
      toast.error('Please select a valid difficulty');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/problems/sql/mark-solved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: problem.id,
          timeSpent: parsedTimeSpent,
          selfRatedDifficulty: numericDifficulty,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(errorData.message || 'Failed to mark problem as solved');
      }

      const data = await response.json();
      onMarkSolved(problem.id, data.solvedAt);
      setShowModal(false);
      toast.success('Problem marked as solved!');
    } catch (error) {
      console.error('Error marking problem as solved:', error);
      toast.error(error.message || 'Failed to mark problem as solved');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkForRevision = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/problems/sql/mark-revision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: problem.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update revision status');
      }

      const data = await response.json();
      setIsMarkedForRevision(data.markedForRevision);
      onMarkForRevision(problem.id, data.markedForRevision);
      toast.success(
        data.markedForRevision
          ? 'Problem added to revision list'
          : 'Problem removed from revision list'
      );
    } catch (error) {
      console.error('Error updating revision status:', error);
      toast.error(error.message || 'Failed to update revision status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
          {problem.title}
        </h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-difficulty-${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {problem.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowModal(true)}
          disabled={isLoading || problem.solved}
          className={`p-2 rounded-full ${
            problem.solved
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={problem.solved ? 'Solved' : 'Mark as solved'}
        >
          <FaCheck />
        </button>
        <button
          onClick={handleMarkForRevision}
          disabled={isLoading}
          className={`p-2 rounded-full ${
            isMarkedForRevision
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isMarkedForRevision ? 'Remove from revision' : 'Add to revision'}
        >
          <FaBookmark />
        </button>
        <a
          href={`${problem.leetcodeLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          title="Open in LeetCode"
        >
          <FaExternalLinkAlt />
        </a>
        {problem.youtubeLink && (
          <button
            onClick={() => setShowYoutubeModal(true)}
            className="p-2 rounded-full bg-gray-100 text-red-600 hover:bg-gray-200"
            title="Watch YouTube Tutorial"
          >
            <FaYoutube />
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Mark Problem as Solved</h3>
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
                  Difficulty Rating
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkSolved}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? 'Marking...' : 'Mark as Solved'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showYoutubeModal && (
        <YouTubeModal
          videoId={extractVideoId(problem.youtubeLink)}
          onClose={() => setShowYoutubeModal(false)}
        />
      )}
    </div>
  );
}
