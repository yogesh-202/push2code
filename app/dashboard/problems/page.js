'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProblemCard from '@/components/ProblemCard';
import TopicFilter from '@/components/TopicFilter';
import DifficultyFilter from '@/components/DifficultyFilter';
import SolvedModal from '@/components/SolvedModal';
import toast from 'react-hot-toast';

export default function Problems() {
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [revisionProblems, setRevisionProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [lockStatus, setLockStatus] = useState(null);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [expandedTopics, setExpandedTopics] = useState({});

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

    // Fetch problems and status
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch daily goals first
        const dailyGoalsResponse = await fetch('/api/daily-goals', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!dailyGoalsResponse.ok) {
          throw new Error('Failed to fetch daily goals');
        }

        const dailyGoalsData = await dailyGoalsResponse.json();
        const dailyGoalIds = new Set(dailyGoalsData.dailyGoals.map(goal => goal.id));
        setDailyGoals(dailyGoalsData.dailyGoals || []);

        // Fetch problems
        const problemsResponse = await fetch('/api/problems', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!problemsResponse.ok) {
          throw new Error('Failed to fetch problems');
        }

        const problemsData = await problemsResponse.json();
        const problemsWithDailyGoalStatus = problemsData.problems.map(problem => ({
          ...problem,
          addedToDailyGoal: dailyGoalIds.has(problem._id?.toString() || problem.id?.toString())
        }));

        setProblems(problemsWithDailyGoalStatus);
        setFilteredProblems(problemsWithDailyGoalStatus);
        setLockStatus(problemsData.lockStatus);

        // Extract unique topics and initialize expanded state
        const uniqueTopics = [...new Set(problemsWithDailyGoalStatus.map(p => p.topic))];
        setTopics(uniqueTopics);
        
        // Initialize all topics as collapsed
        const initialExpandedState = uniqueTopics.reduce((acc, topic) => {
          acc[topic] = false;
          return acc;
        }, {});
        setExpandedTopics(initialExpandedState);
        
        // Fetch revision status
        const revisionResponse = await fetch('/api/problems/revision', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!revisionResponse.ok) {
          throw new Error('Failed to fetch revision status');
        }

        const revisionData = await revisionResponse.json();
        setRevisionProblems(revisionData.revisionProblems || []);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch problems
      const problemsResponse = await fetch('/api/problems', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!problemsResponse.ok) {
        throw new Error('Failed to fetch problems');
      }

      const problemsData = await problemsResponse.json();

      // Fetch daily goals to check which problems are already added
      const dailyGoalsResponse = await fetch('/api/daily-goals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!dailyGoalsResponse.ok) {
        throw new Error('Failed to fetch daily goals');
      }

      const dailyGoalsData = await dailyGoalsResponse.json();
      const dailyGoalIds = new Set(dailyGoalsData.dailyGoals.map(goal => goal.id));

      // Add addedToDailyGoal flag to each problem
      const problemsWithDailyGoalStatus = problemsData.problems.map(problem => ({
        ...problem,
        addedToDailyGoal: dailyGoalIds.has(problem._id || problem.id)
      }));

      setProblems(problemsWithDailyGoalStatus);
      setFilteredProblems(problemsWithDailyGoalStatus);
      setLockStatus(problemsData.lockStatus);

      // Fetch revision status
      const revisionResponse = await fetch('/api/problems/revision', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!revisionResponse.ok) {
        throw new Error('Failed to fetch revision status');
      }

      const revisionData = await revisionResponse.json();
      setRevisionProblems(revisionData.revisionProblems || []);

    } catch (err) {
      console.error('Error fetching problems:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSolved = async (timeSpent, selfRatedDifficulty) => {
    if (!selectedProblem) {
      toast.error('No problem selected');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/problems/mark-solved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: selectedProblem._id || selectedProblem.id,
          timeSpent: parseInt(timeSpent),
          selfRatedDifficulty: parseInt(selfRatedDifficulty)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark problem as solved');
      }

      const data = await response.json();
      
      // Update the problems list to mark this problem as solved
      const updateProblemList = (prevProblems) =>
        prevProblems.map(p =>
          (p._id === selectedProblem._id || p.id === selectedProblem.id)
            ? {
                ...p,
                solved: true,
                solvedAt: data.solvedAt,
                timeSpent: parseInt(timeSpent),
                selfRatedDifficulty: parseInt(selfRatedDifficulty)
              }
            : p
        );

      setProblems(updateProblemList);
      setFilteredProblems(updateProblemList);
      
      // Add to solved problems list
      setSolvedProblems(prev => [...prev, {
        problemId: selectedProblem._id || selectedProblem.id,
        solvedAt: data.solvedAt,
        timeSpent: parseInt(timeSpent),
        selfRatedDifficulty: parseInt(selfRatedDifficulty)
      }]);

      setShowModal(false);
      setSelectedProblem(null);
      toast.success('Problem marked as solved successfully!');
      
      // Dispatch event to update dashboard
      window.dispatchEvent(new Event('problemSolved'));
      
      // Refresh the problems list to get updated data
      fetchProblems();
    } catch (err) {
      console.error('Error marking problem as solved:', err);
      toast.error(err.message || 'Failed to mark problem as solved. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProblem(null);
  };

  const handleMarkRevision = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/problems/mark-revision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId })
      });

      if (!response.ok) {
        throw new Error('Failed to mark problem for revision');
      }

      // Refresh problems to update the UI
      fetchProblems();
    } catch (error) {
      console.error('Error marking problem for revision:', error);
    }
  };

  const toggleTopic = (topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  const handleAddToDailyGoal = async (problem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId: problem._id || problem.id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add problem to daily goals');
      }

      const data = await response.json();
      
      // Create a Set of all problem IDs in daily goals
      const dailyGoalIds = new Set(data.dailyGoals.map(goal => goal.id));
      
      // Update the problems list to reflect the new daily goal status
      const updatedProblems = problems.map(p => ({
        ...p,
        addedToDailyGoal: dailyGoalIds.has(p._id?.toString() || p.id?.toString())
      }));
      
      setProblems(updatedProblems);
      setFilteredProblems(
        updatedProblems.filter(p => 
          (filters.topic === 'all' || p.topic === filters.topic) &&
          (filters.difficulty === 'all' || p.difficulty.toLowerCase() === filters.difficulty.toLowerCase()) &&
          (filters.status === 'all' || 
           (filters.status === 'solved' && p.solved) || 
           (filters.status === 'unsolved' && !p.solved)) &&
          (!filters.search || 
           p.title.toLowerCase().includes(filters.search.toLowerCase()) || 
           p.topic.toLowerCase().includes(filters.search.toLowerCase()))
        )
      );
      
      // Update daily goals state
      setDailyGoals(data.dailyGoals);
      
      toast.success('Problem added to daily goals');
    } catch (error) {
      console.error('Error adding to daily goals:', error);
      toast.error(error.message || 'Failed to add problem to daily goals');
    }
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

      {/* Sunday lock banner */}
      {lockStatus?.isLocked && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Sunday Revision Day!</p>
          <p>Complete your revision and backlog problems to unlock new problems.</p>
          <div className="mt-2">
            <p>Revision Problems: {lockStatus.solvedRevisionCount}/{lockStatus.revisionCount} solved</p>
            <p>Backlog Problems: {lockStatus.solvedBacklogCount}/{lockStatus.backlogCount} solved</p>
          </div>
        </div>
      )}

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

      {/* Problems By Topic */}
      <div className="space-y-4">
        {filteredProblems.length > 0 ? (
          <div>
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
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                          {problems.filter(p => p.solved).length} solved
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
                            key={problem._id || problem.id} 
                            problem={{
                              ...problem,
                              markedForRevision: revisionProblems.some(p => p.id === (problem._id || problem.id)),
                              addedToDailyGoal: problem.addedToDailyGoal
                            }}
                            onClick={() => handleProblemClick(problem)}
                            onMarkSolved={handleMarkSolved}
                            onMarkRevision={handleMarkRevision}
                            onAddToDailyGoal={handleAddToDailyGoal}
                            lockStatus={lockStatus}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
          onSubmit={handleMarkSolved}
        />
      )}
    </div>
  );
}