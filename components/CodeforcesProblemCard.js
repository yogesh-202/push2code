import Link from 'next/link';

export default function CodeforcesProblemCard({ problem, onSolvedToggle, solved = false }) {
  // Get difficulty color based on Codeforces rating
  const getDifficultyColor = (rating) => {
    if (!rating) return 'bg-gray-200 text-gray-800';
    
    if (rating < 1200) return 'bg-gray-200 text-gray-800';
    if (rating < 1400) return 'bg-green-200 text-green-800';
    if (rating < 1600) return 'bg-cyan-200 text-cyan-800';
    if (rating < 1900) return 'bg-blue-200 text-blue-800';
    if (rating < 2100) return 'bg-purple-200 text-purple-800';
    if (rating < 2400) return 'bg-orange-200 text-orange-800';
    return 'bg-red-200 text-red-800';
  };
  
  return (
    <div className={`border ${solved ? 'border-green-500 dark:border-green-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {problem.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(problem.rating)}`}>
            {problem.rating || 'Unrated'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          <span className="font-medium">Problem {problem.contestId}{problem.index}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {problem.tags && problem.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Link 
            href={problem.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
          >
            Solve Problem →
          </Link>
          
          <button
            onClick={() => onSolvedToggle && onSolvedToggle(problem.id)}
            className={`text-sm px-3 py-1 rounded-md ${
              solved 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {solved ? 'Solved ✓' : 'Mark Solved'}
          </button>
        </div>
      </div>
    </div>
  );
}