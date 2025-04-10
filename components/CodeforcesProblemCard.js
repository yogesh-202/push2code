import { useState } from 'react';

export default function CodeforcesProblemCard({ problem, onSolvedToggle, solved = false }) {
  const [isSolved, setIsSolved] = useState(solved);
  
  const handleSolvedToggle = () => {
    const newValue = !isSolved;
    setIsSolved(newValue);
    
    if (onSolvedToggle) {
      onSolvedToggle(problem.id, newValue);
    }
  };
  
  // Get color based on problem rating
  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-500 dark:text-gray-400';
    
    if (rating < 1200) return 'text-gray-800 dark:text-gray-200';
    if (rating < 1400) return 'text-green-600 dark:text-green-400';
    if (rating < 1600) return 'text-cyan-600 dark:text-cyan-400';
    if (rating < 1900) return 'text-blue-600 dark:text-blue-400';
    if (rating < 2100) return 'text-purple-600 dark:text-purple-400';
    if (rating < 2400) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  // Badge background color based on problem rating
  const getRatingBgColor = (rating) => {
    if (!rating) return 'bg-gray-100 dark:bg-gray-700';
    
    if (rating < 1200) return 'bg-gray-100 dark:bg-gray-700';
    if (rating < 1400) return 'bg-green-100 dark:bg-green-900/30';
    if (rating < 1600) return 'bg-cyan-100 dark:bg-cyan-900/30';
    if (rating < 1900) return 'bg-blue-100 dark:bg-blue-900/30';
    if (rating < 2100) return 'bg-purple-100 dark:bg-purple-900/30';
    if (rating < 2400) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };
  
  const ratingColor = getRatingColor(problem.rating);
  const ratingBgColor = getRatingBgColor(problem.rating);
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border ${isSolved ? 'border-green-500 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {problem.name}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${ratingBgColor} ${ratingColor}`}>
            {problem.rating || 'Unrated'}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {problem.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {problem.tags?.length > 3 && (
              <span className="inline-block text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                +{problem.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>
            Contest #{problem.contestId} - Problem {problem.index}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <a 
            href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-center transition-colors"
          >
            Solve
          </a>
          
          <button 
            onClick={handleSolvedToggle}
            className={`flex-1 font-medium py-2 px-4 rounded text-center transition-colors ${
              isSolved 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {isSolved ? 'Solved ✓' : 'Mark Solved'}
          </button>
        </div>
      </div>
    </div>
  );
}