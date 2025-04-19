'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SqlProblemCard from '@/components/SqlProblemCard';
import { toast } from 'react-hot-toast';

export default function SqlProblemsPage() {
  const { data: session } = useSession();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSolved, setShowSolved] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [revisionCount, setRevisionCount] = useState(0);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/problems/sql', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }

        const data = await response.json();
        setProblems(data);
        setSolvedCount(data.filter(p => p.solved).length);
        setRevisionCount(data.filter(p => p.markedForRevision).length);
        
        // Extract all unique tags
        const tags = new Set();
        data.forEach(problem => {
          if (problem.tags) {
            problem.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError(error.message);
        toast.error('Failed to load problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleMarkSolved = (problemId, solvedAt) => {
    setProblems(problems.map(p => 
      p.id === problemId ? { ...p, solved: true, solvedAt } : p
    ));
    setSolvedCount(prev => prev + 1);
  };

  const handleMarkForRevision = (problemId, marked) => {
    setProblems(problems.map(p => 
      p.id === problemId ? { ...p, markedForRevision: marked } : p
    ));
    setRevisionCount(prev => marked ? prev + 1 : prev - 1);
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => problem.tags.includes(tag));
    const matchesSolved = !showSolved || problem.solved;
    const matchesRevision = !showRevision || problem.markedForRevision;
    
    return matchesSearch && matchesDifficulty && matchesTags && matchesSolved && matchesRevision;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">SQL Problems</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Problems</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{problems.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Solved</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{solvedCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">For Revision</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{revisionCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showSolved"
              checked={showSolved}
              onChange={(e) => setShowSolved(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showSolved" className="text-sm text-gray-700 dark:text-gray-300">
              Show Solved Only
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showRevision"
              checked={showRevision}
              onChange={(e) => setShowRevision(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showRevision" className="text-sm text-gray-700 dark:text-gray-300">
              Show Revision Only
            </label>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map(problem => (
          <SqlProblemCard
            key={problem.id}
            problem={problem}
            onMarkSolved={handleMarkSolved}
            onMarkForRevision={handleMarkForRevision}
          />
        ))}
      </div>
    </div>
  );
}