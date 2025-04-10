import { useState, useEffect } from 'react';
import ProblemCard from './ProblemCard';

export default function CriticalUnsolvedProblems() {
  const [criticalProblems, setCriticalProblems] = useState({});
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  
  useEffect(() => {
    const fetchCriticalProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch('/api/problems/critical-unsolved', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch critical unsolved problems');
        }
        
        const data = await response.json();
        setCriticalProblems(data.criticalUnsolved || {});
        setTopics(['all', ...Object.keys(data.criticalUnsolved || {})]);
      } catch (err) {
        console.error('Error fetching critical unsolved problems:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCriticalProblems();
  }, []);
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
  
  if (Object.keys(criticalProblems).length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No critical topics identified</h3>
        <p>
          This could be because you've solved most problems or you haven't solved enough
          problems yet for us to identify your critical topics. Keep practicing!
        </p>
      </div>
    );
  }
  
  const renderProblemsForTopic = (topic) => {
    if (topic === 'all') {
      // For "all", render all topics with headers
      return (
        <div className="space-y-8">
          {Object.entries(criticalProblems).map(([topicName, problems]) => (
            <div key={topicName} className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                {topicName}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({problems.length} problems)
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems.map(problem => (
                  <ProblemCard 
                    key={problem.id || problem._id} 
                    problem={problem} 
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // For a specific topic, render just the problems
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalProblems[topic].map(problem => (
            <ProblemCard 
              key={problem.id || problem._id} 
              problem={problem} 
              onClick={() => {}}
            />
          ))}
        </div>
      );
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Critical Unsolved Problems
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          (Focus on these to improve your weak areas)
        </span>
      </h2>
      
      <div className="mb-6">
        <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Critical Topic
        </label>
        <select
          id="topic-select"
          value={selectedTopic}
          onChange={e => setSelectedTopic(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          {topics.map(topic => (
            <option key={topic} value={topic}>
              {topic === 'all' ? 'All Critical Topics' : topic}
            </option>
          ))}
        </select>
      </div>
      
      {renderProblemsForTopic(selectedTopic)}
    </div>
  );
}