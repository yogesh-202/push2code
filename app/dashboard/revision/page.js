'use client';

import { useState, useEffect } from 'react';
import ProblemCard from '@/components/ProblemCard';
import TopicFilter from '@/components/TopicFilter';
import DifficultyFilter from '@/components/DifficultyFilter';

export default function RevisionPage() {
  const [revisionProblems, setRevisionProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [expandedTopics, setExpandedTopics] = useState({});
  
  // Filters state
  const [filters, setFilters] = useState({
    topic: 'all',
    difficulty: 'all',
    search: '',
  });

  // Filtered problems
  const [filteredProblems, setFilteredProblems] = useState([]);

  useEffect(() => {
    const fetchRevisionProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/problems/revision', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch revision problems: ${response.statusText}`);
        }

        const data = await response.json();
        const problems = data.revisionProblems || [];
        setRevisionProblems(problems);
        setFilteredProblems(problems);
        
        // Extract unique topics
        const uniqueTopics = [...new Set(problems.map(p => p.topic))];
        setTopics(uniqueTopics);
        
        // Initialize all topics as collapsed
        const initialExpandedState = uniqueTopics.reduce((acc, topic) => {
          acc[topic] = false;
          return acc;
        }, {});
        setExpandedTopics(initialExpandedState);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching revision problems:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevisionProblems();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...revisionProblems];

    // Apply topic filter
    if (filters.topic !== 'all') {
      result = result.filter(p => p.topic === filters.topic);
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      result = result.filter(p => p.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.topic.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProblems(result);
  }, [filters, revisionProblems]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRemoveFromRevision = (problemId) => {
    setRevisionProblems(prev => prev.filter(problem => problem.id !== problemId));
  };

  const toggleTopic = (topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Problems for Revision
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Problems that need revision based on your solve history and difficulty ratings
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="md:w-1/3">
            <TopicFilter 
              topics={topics} 
              selectedTopic={filters.topic} 
              onChange={(topic) => handleFilterChange('topic', topic)} 
            />
          </div>
          <div className="md:w-1/3">
            <DifficultyFilter 
              selectedDifficulty={filters.difficulty} 
              onChange={(difficulty) => handleFilterChange('difficulty', difficulty)} 
            />
          </div>
          <div className="md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Search by title or topic"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Problems List */}
      {filteredProblems.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            {revisionProblems.length === 0 
              ? "No problems marked for revision yet. Mark problems for revision from the Problems page."
              : "No problems match your current filters."}
          </p>
          {revisionProblems.length > 0 && filters.topic !== 'all' || filters.difficulty !== 'all' || filters.search !== '' ? (
            <button 
              onClick={() => setFilters({ topic: 'all', difficulty: 'all', search: '' })} 
              className="mt-4 btn-secondary"
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(
            filteredProblems.reduce((acc, problem) => {
              const topic = problem.topic || 'Other';
              if (!acc[topic]) acc[topic] = [];
              acc[topic].push(problem);
              return acc;
            }, {})
          ).map(([topic, problems]) => {
            // Sort problems by difficulty (Easy -> Medium -> Hard)
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            const sortedProblems = problems.sort((a, b) => 
              difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
            );

            return (
              <div key={topic} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleTopic(topic)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{topic}</h2>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {problems.length} problems
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {expandedTopics[topic] ? 'Click to collapse' : 'Click to expand'}
                    </div>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
                        expandedTopics[topic] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                
                {expandedTopics[topic] && (
                  <div className="p-6 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedProblems.map((problem) => (
                        <ProblemCard 
                          key={problem.id} 
                          problem={problem}
                          onClick={() => window.open(problem.link, '_blank')}
                          isRevisionPage={true}
                          onMarkRevision={handleRemoveFromRevision}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
