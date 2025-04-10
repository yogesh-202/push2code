'use client';

import { useState } from 'react';

export default function SolvedModal({ problem, onClose, onSubmit }) {
  const [timeSpent, setTimeSpent] = useState('');
  const [selfRatedDifficulty, setSelfRatedDifficulty] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = {};
    
    if (!timeSpent || isNaN(parseInt(timeSpent)) || parseInt(timeSpent) <= 0) {
      formErrors.timeSpent = 'Please enter a valid time in minutes';
    }
    
    if (!selfRatedDifficulty) {
      formErrors.selfRatedDifficulty = 'Please select your perceived difficulty';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    onSubmit(parseInt(timeSpent), selfRatedDifficulty);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mark as Solved
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Great job solving <span className="font-medium text-gray-900 dark:text-white">{problem?.title}</span>! Please track your performance:
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="timeSpent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Spent (minutes)
              </label>
              <input
                type="number"
                id="timeSpent"
                className={`input-field ${errors.timeSpent ? 'border-red-500 dark:border-red-500' : ''}`}
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                min="1"
                placeholder="e.g., 30"
              />
              {errors.timeSpent && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.timeSpent}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Self-Rated Difficulty
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md border ${
                    selfRatedDifficulty === 'Easy'
                      ? 'bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelfRatedDifficulty('Easy')}
                >
                  Easy
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md border ${
                    selfRatedDifficulty === 'Medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelfRatedDifficulty('Medium')}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md border ${
                    selfRatedDifficulty === 'Hard'
                      ? 'bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelfRatedDifficulty('Hard')}
                >
                  Hard
                </button>
              </div>
              {errors.selfRatedDifficulty && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.selfRatedDifficulty}</p>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                Save Progress
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
