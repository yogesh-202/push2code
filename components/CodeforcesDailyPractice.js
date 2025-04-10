import { useState, useEffect } from 'react';

export default function CodeforcesDailyPractice({ handle }) {
  const [dailyProblems, setDailyProblems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(null);
  
  useEffect(() => {
    const fetchDailyProblems = async () => {
      if (!handle) {
        setError('Please enter your Codeforces handle');
        setLoading(false);
        return;
      }
      
      try {
        // We could get solved problems from the backend, but for simplicity
        // we'll just pass an empty set here
        const response = await fetch(`/api/codeforces/daily-practice?handle=${handle}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch daily practice problems');
        }
        
        const data = await response.json();
        setDailyProblems(data.dailyProblems);
        setUserRating(data.userRating);
      } catch (err) {
        console.error('Error fetching daily problems:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDailyProblems();
  }, [handle]);
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }
  
  if (!dailyProblems) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Unable to generate daily problems</h3>
        <p>
          We couldn't generate daily practice problems. This could be due to an issue with 
          the Codeforces API or because there aren't enough unsolved problems at your rating level.
        </p>
      </div>
    );
  }
  
  const renderProblemCard = (problem, difficulty) => {
    if (!problem) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No {difficulty} problem available at the moment
          </p>
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {problem.name}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              difficulty === 'easier' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
              difficulty === 'onLevel' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {problem.rating} rating
            </span>
          </div>
          
          <div className="mb-3">
            {problem.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded mr-2 mb-2">
                {tag}
              </span>
            ))}
            {problem.tags?.length > 3 && (
              <span className="inline-block text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                +{problem.tags.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Contest #{problem.contestId}, Problem {problem.index}
          </div>
          
          <a 
            href={problem.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-center transition-colors"
          >
            Solve Problem
          </a>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Daily Codeforces Practice
        </h2>
        {userRating !== null && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Based on your current rating: <span className="font-medium">{userRating}</span>
          </p>
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
            Warm Up (Easier Problem)
          </h3>
          {renderProblemCard(dailyProblems.easier, 'easier')}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
            On Your Level
          </h3>
          {renderProblemCard(dailyProblems.onLevel, 'onLevel')}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
            Challenge Yourself (Harder Problem)
          </h3>
          {renderProblemCard(dailyProblems.harder, 'harder')}
        </div>
      </div>
    </div>
  );
}