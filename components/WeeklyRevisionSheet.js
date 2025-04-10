import { useState, useEffect } from 'react';
import ProblemCard from './ProblemCard';

export default function WeeklyRevisionSheet() {
  const [revisionProblems, setRevisionProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRevisionProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch('/api/problems/revision', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch revision problems');
        }
        
        const data = await response.json();
        setRevisionProblems(data.revisionProblems || []);
      } catch (err) {
        console.error('Error fetching revision problems:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRevisionProblems();
  }, []);
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
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
  
  if (revisionProblems.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No revision problems available</h3>
        <p>
          You need to solve more problems to get personalized revision recommendations.
          Focus on solving problems across different topics.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Weekly Revision Problems
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          (Based on your critical topics)
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {revisionProblems.map(problem => (
          <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {problem.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  problem.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
                  {problem.topic}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last solved: {new Date(problem.solvedAt).toLocaleDateString()}
              </div>
              
              <a 
                href={problem.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-center transition-colors"
              >
                Practice Again
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}