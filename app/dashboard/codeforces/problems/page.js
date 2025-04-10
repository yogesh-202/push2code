'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CodeforcesProblemCard from '@/components/CodeforcesProblemCard';
import CodeforcesDailyPractice from '@/components/CodeforcesDailyPractice';

export default function CodeforcesProblems() {
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cfHandle, setCfHandle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [ratingRange, setRatingRange] = useState([800, 3500]);
  const [availableTags, setAvailableTags] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Get Codeforces handle from localStorage if available
    const savedHandle = localStorage.getItem('cfHandle');
    if (savedHandle) {
      setCfHandle(savedHandle);
    }
    
    fetchProblems();
  }, [router]);
  
  async function fetchProblems() {
    try {
      setLoading(true);
      
      const response = await fetch('/api/codeforces/problems');
      
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      
      const data = await response.json();
      setProblems(data.problems || []);
      
      // Extract unique tags
      const tags = new Set();
      data.problems.forEach(problem => {
        problem.tags?.forEach(tag => tags.add(tag));
      });
      setAvailableTags(Array.from(tags).sort());
      
      // Load solved problems from localStorage
      const savedSolved = localStorage.getItem('cfSolvedProblems');
      if (savedSolved) {
        setSolvedProblems(new Set(JSON.parse(savedSolved)));
      }
      
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  const handleSaveHandle = () => {
    if (cfHandle.trim()) {
      localStorage.setItem('cfHandle', cfHandle.trim());
      // Refresh page to get problems for this handle
      window.location.reload();
    }
  };
  
  const handleSolvedToggle = (problemId, isSolved) => {
    const newSolvedProblems = new Set(solvedProblems);
    
    if (isSolved) {
      newSolvedProblems.add(problemId);
    } else {
      newSolvedProblems.delete(problemId);
    }
    
    setSolvedProblems(newSolvedProblems);
    localStorage.setItem('cfSolvedProblems', JSON.stringify([...newSolvedProblems]));
  };
  
  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleRatingChange = (min, max) => {
    setRatingRange([min, max]);
  };
  
  // Filter problems based on selected filters
  const filteredProblems = problems.filter(problem => {
    // Filter by rating
    if (problem.rating && (problem.rating < ratingRange[0] || problem.rating > ratingRange[1])) {
      return false;
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      // Check if problem has at least one of the selected tags
      const hasSelectedTag = selectedTags.some(tag => problem.tags?.includes(tag));
      if (!hasSelectedTag) {
        return false;
      }
    }
    
    // Filter by solved status for the 'solved' and 'unsolved' tabs
    if (activeTab === 'solved' && !solvedProblems.has(problem.id)) {
      return false;
    }
    
    if (activeTab === 'unsolved' && solvedProblems.has(problem.id)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Codeforces Problems
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A curated list of quality problems for practice
          </p>
        </div>
        
        {/* Codeforces Handle Input */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="cf-handle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Codeforces Handle
              </label>
              <input
                type="text"
                id="cf-handle"
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
                placeholder="Enter your Codeforces handle"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleSaveHandle}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              Save Handle
            </button>
          </div>
          
          {cfHandle && (
            <div className="mt-4">
              <a 
                href={`https://codeforces.com/profile/${cfHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center"
              >
                View Codeforces Profile
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
        
        {/* Daily Practice Section */}
        {cfHandle && (
          <div className="mb-8">
            <CodeforcesDailyPractice handle={cfHandle} />
          </div>
        )}
        
        {/* Problem Filters and List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Filters
              </h2>
              
              {/* Tabs */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  View
                </h3>
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === 'solved'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveTab('solved')}
                  >
                    Solved
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === 'unsolved'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveTab('unsolved')}
                  >
                    Unsolved
                  </button>
                </div>
              </div>
              
              {/* Rating Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty (Rating)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{ratingRange[0]}</span>
                    <span>{ratingRange[1]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="800"
                      max="3500"
                      value={ratingRange[0]}
                      onChange={(e) => handleRatingChange(parseInt(e.target.value), ratingRange[1])}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="800"
                      max="3500"
                      value={ratingRange[1]}
                      onChange={(e) => handleRatingChange(ratingRange[0], parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </h3>
                <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                  {availableTags.map(tag => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Problem List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
                <p>{error}</p>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Solved: {[...solvedProblems].filter(id => problems.some(p => p.id === id)).length} / {problems.length}
                  </p>
                </div>
                
                <div className="space-y-6">
                  {filteredProblems.map(problem => (
                    <CodeforcesProblemCard
                      key={problem.id}
                      problem={problem}
                      solved={solvedProblems.has(problem.id)}
                      onSolvedToggle={handleSolvedToggle}
                    />
                  ))}
                  
                  {filteredProblems.length === 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-6 rounded-lg">
                      <p>No problems match your current filters. Try adjusting your filter criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}