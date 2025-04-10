import { useState } from 'react';

export default function SolvedModal({ problem, onClose, onSubmit }) {
  const [timeSpent, setTimeSpent] = useState('');
  const [difficulty, setDifficulty] = useState('3');
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert timeSpent to minutes
    let timeInMinutes = 0;
    
    if (timeSpent.includes(':')) {
      const [hours, minutes] = timeSpent.split(':').map(Number);
      timeInMinutes = (hours * 60) + minutes;
    } else {
      // Assume input is in minutes
      timeInMinutes = parseInt(timeSpent, 10) || 0;
    }
    
    onSubmit({
      timeSpent: timeInMinutes,
      difficulty: parseInt(difficulty, 10),
      notes,
      solvedAt: new Date().toISOString()
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Mark as Solved
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 dark:text-white">
              {problem.title}
            </h4>
            <div className="flex mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {problem.topic} • {problem.difficulty}
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Spent
              </label>
              <input
                type="text"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="e.g., 1:30 (hh:mm) or 90 (minutes)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter time in hh:mm format or total minutes
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Self-Rated Difficulty (1-5)
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value={value}
                      checked={difficulty === value.toString()}
                      onChange={() => setDifficulty(value.toString())}
                      className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{value}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                1 = Very Easy, 5 = Very Difficult
              </p>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your solution approach, key insights, or things to remember"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}