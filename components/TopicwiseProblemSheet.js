import { useState, useEffect } from 'react';
import ProblemCard from './ProblemCard';

export default function TopicwiseProblemSheet() {
  const [topics, setTopics] = useState([]);
  const [organizedProblems, setOrganizedProblems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [expandedDifficulties, setExpandedDifficulties] = useState({
    easy: true,
    medium: true,
    hard: true
  });
  
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch('/api/problems/topic-wise', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        
        const data = await response.json();
        setOrganizedProblems(data.organizedProblems);
        setTopics(['all', ...Object.keys(data.organizedProblems)]);
      } catch (err) {
        console.error('Error fetching topic-wise problems:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblems();
  }, []);
  
  const toggleDifficulty = (difficulty) => {
    setExpandedDifficulties(prev => ({
      ...prev,
      [difficulty]: !prev[difficulty]
    }));
  };
  
  const renderProblemsForTopic = (topic) => {
    if (topic === 'all') {
      // For "all", we render all topics with headers
      return (
        <div className="space-y-8">
          {Object.entries(organizedProblems).map(([topicName, difficulties]) => (
            <div key={topicName} className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {topicName}
              </h3>
              {renderDifficulties(difficulties)}
            </div>
          ))}
        </div>
      );
    } else {
      // For a specific topic, render just the difficulties
      return renderDifficulties(organizedProblems[topic]);
    }
  };
  
  const renderDifficulties = (difficulties) => {
    return (
      <div className="space-y-6">
        {/* Easy Problems */}
        <div>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => toggleDifficulty('easy')}
          >
            <h4 className="text-lg font-semibold text-green-600 dark:text-green-400">
              Easy Problems
            </h4>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({difficulties.easy.length})
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`ml-auto h-5 w-5 text-gray-400 transform transition-transform ${expandedDifficulties.easy ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {expandedDifficulties.easy && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {difficulties.easy.map(problem => (
                <ProblemCard 
                  key={problem.id || problem._id} 
                  problem={problem} 
                  onClick={() => {}}
                />
              ))}
              {difficulties.easy.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No easy problems for this topic.
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Medium Problems */}
        <div>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => toggleDifficulty('medium')}
          >
            <h4 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              Medium Problems
            </h4>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({difficulties.medium.length})
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`ml-auto h-5 w-5 text-gray-400 transform transition-transform ${expandedDifficulties.medium ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {expandedDifficulties.medium && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {difficulties.medium.map(problem => (
                <ProblemCard 
                  key={problem.id || problem._id} 
                  problem={problem} 
                  onClick={() => {}}
                />
              ))}
              {difficulties.medium.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No medium problems for this topic.
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Hard Problems */}
        <div>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => toggleDifficulty('hard')}
          >
            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Hard Problems
            </h4>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({difficulties.hard.length})
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`ml-auto h-5 w-5 text-gray-400 transform transition-transform ${expandedDifficulties.hard ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {expandedDifficulties.hard && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {difficulties.hard.map(problem => (
                <ProblemCard 
                  key={problem.id || problem._id} 
                  problem={problem} 
                  onClick={() => {}}
                />
              ))}
              {difficulties.hard.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No hard problems for this topic.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  
  return (
    <div>
      <div className="mb-6">
        <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Topic
        </label>
        <select
          id="topic-select"
          value={selectedTopic}
          onChange={e => setSelectedTopic(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          {topics.map(topic => (
            <option key={topic} value={topic}>
              {topic === 'all' ? 'All Topics' : topic}
            </option>
          ))}
        </select>
      </div>
      
      {renderProblemsForTopic(selectedTopic)}
    </div>
  );
}