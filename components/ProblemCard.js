'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProblemCard({ problem, onClick, onMarkSolved, onMarkRevision, onAddToDailyGoal, lockStatus, isRevisionPage = false }) {
  if (!problem) return null;

  const { _id, id, title, difficulty, acceptance, topic, solved, isBacklog, originalDate, markedForRevision, addedToDailyGoal } = problem;
  const problemId = _id || id; // Use either _id or id

  // Map difficulty to color classes
  const difficultyClass = difficulty.toLowerCase();

  const [isMarkedForRevision, setIsMarkedForRevision] = useState(markedForRevision || false);
  const [isAddedToDailyGoal, setIsAddedToDailyGoal] = useState(addedToDailyGoal || false);
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date();
  const isSunday = today.getDay() === 0;

  // Update local state when prop changes
  useEffect(() => {
    setIsAddedToDailyGoal(addedToDailyGoal || false);
  }, [addedToDailyGoal]);

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
        body: JSON.stringify({ problemId })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle revision status');
      }

      const data = await response.json();
      setIsMarkedForRevision(data.markedForRevision);
      problem.markedForRevision = data.markedForRevision;
      toast.success(data.markedForRevision ? 'Added to revision list' : 'Removed from revision list');
    } catch (error) {
      console.error("Error toggling revision:", error);
      toast.error('Failed to update revision status');
    }
  };

  const handleRemoveFromRevision = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/problems/mark-revision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId, remove: true })
      });

      if (!response.ok) {
        throw new Error('Failed to remove problem from revision');
      }

      // If we're on the revision page, we can remove the problem from the list
      if (isRevisionPage && onMarkRevision) {
        onMarkRevision(problemId);
      } else {
        setIsMarkedForRevision(false);
        problem.markedForRevision = false;
      }
      toast.success('Removed from revision list');
    } catch (error) {
      console.error("Error removing from revision:", error);
      toast.error('Failed to remove from revision list');
    }
  };

  const handleAddToDailyGoal = async (e) => {
    e.stopPropagation();
    if (isLoading || isAddedToDailyGoal) return;

    setIsLoading(true);
    try {
      // Call the parent component's handler
      await onAddToDailyGoal(problem);
      
      // Update local state
      setIsAddedToDailyGoal(true);
    } catch (error) {
      console.error('Error adding problem to daily goals:', error);
      toast.error(error.message || 'Failed to add to daily goals');
      setIsAddedToDailyGoal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProblemClick = () => {
    if (problem.isLocked) return;
    onClick(problem);
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer ${
        problem.isLocked ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleProblemClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{title}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {difficulty}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span>{topic}</span>
        <span>•</span>
        <span>{acceptance}</span>
        {isBacklog && (
          <>
            <span>•</span>
            <span className="text-red-500">From: {originalDate}</span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {solved ? (
          <>
            <span className="flex items-center text-green-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Solved
            </span>
            {!isRevisionPage && (
              <button
                onClick={handleRevisionToggle}
                className={`ml-2 px-2 py-1 text-xs rounded transition-colors duration-200 
                  ${isMarkedForRevision ? 
                    'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100' : 
                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}
              >
                {isMarkedForRevision ? 'Marked' : 'Revise'}
              </button>
            )}
          </>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">Unsolved</span>
        )}

        {/* Add to Daily Goal Button */}
        <button
          onClick={handleAddToDailyGoal}
          disabled={isAddedToDailyGoal || isLoading}
          className={`ml-2 px-2 py-1 text-xs rounded transition-colors duration-200 
            ${isAddedToDailyGoal ? 
              'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 cursor-not-allowed' : 
              isLoading ?
              'bg-gray-100 text-gray-400 cursor-wait' :
              'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100'
            }`}
        >
          {isLoading ? 'Adding...' : isAddedToDailyGoal ? 'Added' : 'Add to Daily Goal'}
        </button>

        {/* Remove from Revision Button (only shown on revision page) */}
        {isRevisionPage && (
          <button
            onClick={handleRemoveFromRevision}
            className="ml-2 px-2 py-1 text-xs rounded transition-colors duration-200 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100"
          >
            Remove from Revision
          </button>
        )}
      </div>

      {/* Sunday lock message */}
      {isSunday && problem.isLocked && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Sunday is revision day! Complete your revision and backlog problems to unlock new problems.
          </p>
          {lockStatus && (
            <div className="mt-2 text-xs text-yellow-700">
              <p>Revision Problems: {lockStatus.solvedRevisionCount}/{lockStatus.revisionCount} solved</p>
              <p>Backlog Problems: {lockStatus.solvedBacklogCount}/{lockStatus.backlogCount} solved</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}