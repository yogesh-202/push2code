'use client';

export default function ProblemCard({ problem, onClick }) {
  if (!problem) return null;

  const { id, title, difficulty, acceptance, topic, solved } = problem;

  // Map difficulty to color classes
  const difficultyClass = difficulty.toLowerCase();

  return (
    <div 
      className={`card p-5 cursor-pointer transition-all duration-300 ${solved ? 'border-l-4 border-green-500 dark:border-green-600' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">
          {title}
        </h3>
        <span className={`text-sm font-medium px-2 py-1 rounded-full difficulty-${difficultyClass} bg-difficulty-${difficultyClass}`}>
          {difficulty}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Topic: {topic}
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          Acceptance: {acceptance}
        </span>
        
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
            onClick={(e) => {
              e.stopPropagation();
              const token = localStorage.getItem('token');
              fetch('/api/problems/mark-revision', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ problemId: id })
              })
              .then(async (response) => {
                const data = await response.json();
                // Update the problem's markedForRevision status
                problem.markedForRevision = !problem.markedForRevision;
                // Force a re-render by updating the button's parent
                e.target.closest('.card').classList.toggle('marked-for-revision');
              });
            }}
            className={`px-2 py-1 text-xs rounded transition-colors duration-200 
              ${problem.markedForRevision ? 
                'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100' : 
                'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100'
              }`}
          >
            {problem.markedForRevision ? 'Marked' : 'Revise'}
          </button>
        </div>
      </div>
    </div>
  );
}
