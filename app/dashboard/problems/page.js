'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProblemCard from '@/components/ProblemCard';
import TopicFilter from '@/components/TopicFilter';
import DifficultyFilter from '@/components/DifficultyFilter';
import SolvedModal from '@/components/SolvedModal';

export default function Problems() {
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    topic: 'all',
    difficulty: 'all',
    status: 'all',
    search: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch problems
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/problems', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }

        const data = await response.json();
        setProblems(data.problems);
        setFilteredProblems(data.problems);
        
        // Extract unique topics
        const uniqueTopics = [...new Set(data.problems.map(p => p.topic))];
        setTopics(uniqueTopics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [router]);

  // Apply filters
  useEffect(() => {
    let result = [...problems];
    
    // Apply topic filter
    if (filters.topic !== 'all') {
      result = result.filter(p => p.topic === filters.topic);
    }
    
    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      result = result.filter(p => p.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }
    
    // Apply status filter
    if (filters.status === 'solved') {
      result = result.filter(p => p.solved);
    } else if (filters.status === 'unsolved') {
      result = result.filter(p => !p.solved);
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
  }, [filters, problems]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleProblemClick = (problem) => {
    // Open the LeetCode problem in a new tab
    window.open(problem.link, '_blank');
    
    // If not already solved, show the mark as solved modal
    if (!problem.solved) {
      setSelectedProblem(problem);
      setShowModal(true);
    }
  };

  const handleMarkAsSolved = async (timeSpent, selfRatedDifficulty) => {
    if (!selectedProblem) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/problems/mark-solved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          timeSpent,
          selfRatedDifficulty
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark problem as solved');
      }
      
      // Update the problems list
      setProblems(prev => 
        prev.map(p => 
          p.id === selectedProblem.id 
            ? { ...p, solved: true, timeSpent, selfRatedDifficulty, solvedAt: new Date() } 
            : p
        )
      );
      
      setShowModal(false);
      setSelectedProblem(null);
    } catch (err) {
      console.error(err);
      alert('Failed to mark problem as solved. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProblem(null);
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
      
      {/* Filters Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
      
      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <ProblemCard 
              key={problem.id} 
              problem={problem} 
              onClick={() => handleProblemClick(problem)} 
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">No problems found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search criteria.
            </p>
            <button 
              onClick={() => setFilters({ topic: 'all', difficulty: 'all', status: 'all', search: '' })} 
              className="mt-4 btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Mark as Solved Modal */}
      {showModal && (
        <SolvedModal
          problem={selectedProblem}
          onClose={closeModal}
          onSubmit={handleMarkAsSolved}
        />
      )}
    </div>
  );
}
