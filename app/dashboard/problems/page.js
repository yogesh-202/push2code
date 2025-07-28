'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProblemCard from '@/components/ProblemCard';
import TopicFilter from '@/components/TopicFilter';
import DifficultyFilter from '@/components/DifficultyFilter';
import toast from 'react-hot-toast';

export default function Problems() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockStatus, setLockStatus] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});

  
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      fetchProblems();
    } else {
      router.push('/login');
    }
  }, [status]);

  
  const [filters, setFilters] = useState({
    topic: 'all',
    difficulty: 'all',
    status: 'all',
    search: '',
  });

  
 
  const applyFilters = useCallback((problems, currentFilters) => {
    let result = [...problems];

    if (currentFilters.topic !== 'all') {
      result = result.filter(p => p.tags.includes(currentFilters.topic));
    }

    if (currentFilters.difficulty !== 'all') {
      result = result.filter(p => p.difficulty.toLowerCase() === currentFilters.difficulty.toLowerCase());
    }

    if (currentFilters.status === 'solved') {
      result = result.filter(p => p.isSolved);
    } else if (currentFilters.status === 'unsolved') {
      result = result.filter(p => !p.isSolved);
    } else if (currentFilters.status === 'revision') {
      result = result.filter(p => p.setToRevision);
    }

    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return result;
  }, []);

  
 
  useEffect(() => {
    const filtered = applyFilters(problems, filters);
    setFilteredProblems(filtered);
  }, [filters, problems, applyFilters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch('/api/problems', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch problems');
      }

      const data = await response.json();
      if (!data.problems) {
        throw new Error('Invalid response format');
      }

      
      const formatProblem = (problem) => ({
        ...problem,
        _id: problem._id || problem.id,
        isSolved: problem.isSolved || false,
        setToRevision: problem.setToRevision || false,
        setToDailyGoal: problem.setToDailyGoal || false,
        
        link: problem.url || problem.link || problem.leetcodeLink || `https://leetcode.com/problems/${problem.slug}`,
        tags: problem.tags || [],
        acceptance: problem.acceptance || 'N/A',
        difficulty: problem.difficulty || 'Medium'
      });



      const transformedProblems = data.problems.map(formatProblem);
      const uniqueTags = [...new Set(transformedProblems.flatMap(p => p.tags))].filter(Boolean);
      
      setProblems(transformedProblems);
      setTopics(uniqueTags);
      setLockStatus(data.lockStatus);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching problems:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleProblemUpdate = useCallback(() => {
    fetchProblems();
  }, []);

  const toggleTopic = (topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          DSA Problems
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse, filter, and track your progress on curated LeetCode problems
        </p>
      </div>

      {/* Sunday lock banner */}
      {lockStatus?.isSunday && lockStatus?.isLocked && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-6" role="alert">
          <p className="font-bold">Sunday Revision Day!</p>
          <p>Complete your revision and backlog problems to unlock new problems.</p>
          <div className="mt-2">
            <p>Revision Problems: {lockStatus.solvedRevisionCount}/{lockStatus.revisionCount} solved</p>
            <p>Backlog Problems: {lockStatus.solvedBacklogCount}/{lockStatus.backlogCount} solved</p>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-8 bg-indigo-300 dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="md:w-1/4">
            <TopicFilter 
              topics={topics} 
              selectedTopic={filters.topic} 
              onChange={(topic) => handleFilterChange('topic', topic)} 
            />
          </div>
          <div className="md:w-1/4">
            <DifficultyFilter 
              selectedDifficulty={filters.difficulty} 
              onChange={(difficulty) => handleFilterChange('difficulty', difficulty)} 
            />
          </div>
          <div className="md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Problems</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
              <option value="revision">Revision Problems</option>
            </select>
          </div>
          <div className="md:w-1/4">
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

      {/* Problems By Topic */}
      <div className="space-y-4">
        {filteredProblems.length > 0 ? (
          <div>
            {Object.entries(
              filteredProblems.reduce((acc, problem) => {
                const primaryTag = problem.tags[0] || 'Other';
                if (!acc[primaryTag]) acc[primaryTag] = [];
                acc[primaryTag].push(problem);
                return acc;
              }, {})
            ).map(([tag, problems]) => {
              const sortedProblems = problems.sort((a, b) => {
                const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
              });

              return (
                <div key={tag} className="bg-indigo-300 dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopic(tag);
                    }}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{tag}</h2>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                          {problems.length} problems
                        </span>
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                          {problems.filter(p => p.isSolved).length} solved
                        </span>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
                        expandedTopics[tag] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedTopics[tag] && (
                    <div className="p-6 pt-0 border-t border-gray-200 dark:border-gray-700 space-y-4" onClick={e => e.stopPropagation()}>
                      {sortedProblems.map((problem) => (
                        <ProblemCard 
                          key={problem._id || problem.id} 
                          problem={problem}
                          onMarkSolved={handleProblemUpdate}
                          onMarkRevision={handleProblemUpdate}
                          onAddToDailyGoal={handleProblemUpdate}
                          lockStatus={lockStatus}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">No problems found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search criteria.
            </p>
            <button 
              onClick={() => setFilters({ topic: 'all', difficulty: 'all', status: 'all', search: '' })} 
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}