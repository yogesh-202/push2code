'use client';

import { useState } from 'react';

export default function CoreSubjectProblemCard({ problem, onMarkSolved, onMarkRevision }) {
  const { id, title, leetcodeId, difficulty, solved, markedForRevision } = problem;
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(markedForRevision || false);
  const [isAddedToDailyGoal, setIsAddedToDailyGoal] = useState(false);

  const handleRevisionToggle = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/problems/mark-revision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId: id })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle revision status');
      }

      const data = await response.json();
      setIsMarkedForRevision(data.markedForRevision);
      problem.markedForRevision = data.markedForRevision;
    } catch (error) {
      console.error("Error toggling revision:", error);
    }
  };

  const handleAddToDailyGoal = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId: id })
      });

      if (!response.ok) {
        throw new Error('Failed to add problem to daily goals');
      }

      setIsAddedToDailyGoal(true);
    } catch (error) {
      console.error('Error adding problem to daily goals:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
            difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}>
            {difficulty}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            LeetCode ID: {leetcodeId}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {solved ? (
          <span className="flex items-center text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Solved
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">Unsolved</span>
        )}

        <button
          onClick={handleRevisionToggle}
          className={`px-2 py-1 text-xs rounded transition-colors duration-200 
            ${isMarkedForRevision ? 
              'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100' : 
              'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100'
            }`}
        >
          {isMarkedForRevision ? 'Marked' : 'Revise'}
        </button>

        <button
          onClick={handleAddToDailyGoal}
          disabled={isAddedToDailyGoal}
          className={`px-2 py-1 text-xs rounded transition-colors duration-200 
            ${isAddedToDailyGoal ? 
              'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 cursor-not-allowed' : 
              'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100'
            }`}
        >
          {isAddedToDailyGoal ? 'Added' : 'Add to Goal'}
        </button>
      </div>
    </div>
  );
} 