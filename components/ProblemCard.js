import { useState } from 'react';
import SolvedModal from './SolvedModal';

export default function ProblemCard({ problem, onClick }) {
  const [showSolvedModal, setShowSolvedModal] = useState(false);
  
  // Extract properties from problem
  const { 
    title, 
    difficulty = 'medium', 
    topic, 
    url, 
    platform = 'leetcode',
    solved = false
  } = problem;
  
  // Function to determine difficulty color
  const getDifficultyColor = (diff) => {
    const diffLower = diff?.toLowerCase() || 'medium';
    
    if (diffLower === 'easy') {
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200'
      };
    } else if (diffLower === 'medium') {
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-200'
      };
    } else {
      return {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-200'
      };
    }
  };
  
  const difficultyColors = getDifficultyColor(difficulty);
  
  // Function to handle clicking the "Mark as Solved" button
  const handleMarkSolved = () => {
    setShowSolvedModal(true);
  };
  
  // Function to handle closing the solved modal
  const handleCloseSolvedModal = () => {
    setShowSolvedModal(false);
  };
  
  // Function to handle submitting the solved data
  const handleSubmitSolved = async (solvedData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch('/api/problems/mark-solved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: problem.id || problem._id,
          ...solvedData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark problem as solved');
      }
      
      // Close the modal and possibly refresh the UI
      setShowSolvedModal(false);
      
      // If there's an onClick handler, call it to refresh the parent
      if (onClick) {
        onClick();
      }
      
      // Show success message (could use a toast notification here)
      alert('Problem marked as solved successfully!');
    } catch (error) {
      console.error('Error marking problem as solved:', error);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border ${solved ? 'border-green-500 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${difficultyColors.bg} ${difficultyColors.text}`}>
              {difficulty}
            </span>
          </div>
          
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
              {topic}
            </span>
            <span className="inline-block ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded">
              {platform}
            </span>
          </div>
          
          {solved && (
            <div className="flex items-center mb-3 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Solved</span>
            </div>
          )}
          
          <div className="flex space-x-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-center transition-colors"
            >
              Solve
            </a>
            
            {!solved && (
              <button 
                onClick={handleMarkSolved}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-center transition-colors"
              >
                Mark Solved
              </button>
            )}
          </div>
        </div>
      </div>
      
      {showSolvedModal && (
        <SolvedModal 
          problem={problem}
          onClose={handleCloseSolvedModal}
          onSubmit={handleSubmitSolved}
        />
      )}
    </>
  );
}