'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeforcesProblemCard from '@/components/CodeforcesProblemCard';

export default function CodeforcesProblems() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);
  const router = useRouter();
  
  // Load problems from API
  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      
      try {
        const response = await fetch('/api/codeforces/problems');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch problems');
        }
        
        setProblems(data.problems);
        setFilteredProblems(data.problems);
        
        // Extract all unique tags
        const tags = new Set();
        data.problems.forEach(problem => {
          problem.tags?.forEach(tag => tags.add(tag));
        });
        setAvailableTags(Array.from(tags).sort());
        
        // Load solved problems from localStorage
        const savedSolved = localStorage.getItem('codeforcesProblems');
        if (savedSolved) {
          setSolvedProblems(new Set(JSON.parse(savedSolved)));
        }
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProblems();
  }, []);
  
  // Filter problems when search term, difficulty, or tag changes
  useEffect(() => {
    if (!problems.length) return;
    
    let filtered = [...problems];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        problem => problem.name.toLowerCase().includes(term) || 
                  problem.id.toLowerCase().includes(term)
      );
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      const [min, max] = selectedDifficulty.split('-').map(Number);
      filtered = filtered.filter(
        problem => problem.rating >= min && problem.rating <= max
      );
    }
    
    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(
        problem => problem.tags && problem.tags.includes(selectedTag)
      );
    }
    
    setFilteredProblems(filtered);
  }, [searchTerm, selectedDifficulty, selectedTag, problems]);
  
  // Toggle solved status
  const handleToggleSolved = (problemId) => {
    const newSolved = new Set(solvedProblems);
    
    if (newSolved.has(problemId)) {
      newSolved.delete(problemId);
    } else {
      newSolved.add(problemId);
    }
    
    setSolvedProblems(newSolved);
    localStorage.setItem('codeforcesProblems', JSON.stringify(Array.from(newSolved)));
  };
  
  // Group problems by difficulty range for statistics
  const getDifficultyStats = () => {
    const stats = {
      'beginner': { total: 0, solved: 0 },
      'easy': { total: 0, solved: 0 },
      'medium': { total: 0, solved: 0 },
      'hard': { total: 0, solved: 0 },
      'expert': { total: 0, solved: 0 }
    };
    
    problems.forEach(problem => {
      let category;
      
      if (!problem.rating || problem.rating < 1200) category = 'beginner';
      else if (problem.rating < 1500) category = 'easy';
      else if (problem.rating < 1800) category = 'medium';
      else if (problem.rating < 2100) category = 'hard';
      else category = 'expert';
      
      stats[category].total++;
      if (solvedProblems.has(problem.id)) {
        stats[category].solved++;
      }
    });
    
    return stats;
  };
  
  const diffStats = getDifficultyStats();
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Codeforces Problem Set</h1>
        <button
          onClick={() => router.push('/dashboard/codeforces/profile')}
          className="mt-2 md:mt-0 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back to Profile
        </button>
      </div>
      
      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Your Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(diffStats).map(([category, stat]) => (
            <div key={category} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm capitalize text-gray-600 dark:text-gray-300">{category}</div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xl font-bold text-gray-800 dark:text-white">
                  {stat.solved}/{stat.total}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0}%
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${stat.total > 0 ? (stat.solved / stat.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Problems
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or ID"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="800-1199">Beginner (800-1199)</option>
              <option value="1200-1499">Easy (1200-1499)</option>
              <option value="1500-1799">Medium (1500-1799)</option>
              <option value="1800-2099">Hard (1800-2099)</option>
              <option value="2100-3500">Expert (2100+)</option>
            </select>
          </div>
          
          {/* Tag Filter */}
          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Problem Tag
            </label>
            <select
              id="tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Problem Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 w-full h-48"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            Showing {filteredProblems.length} of {problems.length} problems
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map(problem => (
              <CodeforcesProblemCard 
                key={problem.id}
                problem={problem}
                onSolvedToggle={handleToggleSolved}
                solved={solvedProblems.has(problem.id)}
              />
            ))}
          </div>
          
          {filteredProblems.length === 0 && (
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-300">No problems match your current filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}