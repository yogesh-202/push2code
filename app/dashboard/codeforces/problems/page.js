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
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const router = useRouter();
  
  const [dailyProblems, setDailyProblems] = useState(null);
  const [userRating, setUserRating] = useState(1500);

  // Function to sync solved problems with Codeforces
  const syncSolvedProblems = async (handle) => {
    try {
      setSyncLoading(true);
      const response = await fetch(`/api/codeforces/sync-solved?handle=${handle}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync solved problems');
      }
      
      // Update solved problems
      setSolvedProblems(new Set(data.solvedProblems));
      setLastSyncTime(data.timestamp);
      
      // Save to localStorage
      localStorage.setItem('codeforcesProblems', JSON.stringify(data.solvedProblems));
      localStorage.setItem('lastSyncTime', data.timestamp);
      
    } catch (error) {
      console.error('Error syncing solved problems:', error);
      throw error;
    } finally {
      setSyncLoading(false);
    }
  };

  // Load user rating and problems
  useEffect(() => {
    async function fetchUserAndProblems() {
      setLoading(true);
      
      try {
        // Get handle from localStorage
        const handle = localStorage.getItem('codeforcesHandle');
        if (!handle) {
          router.push('/dashboard/codeforces/profile');
          return;
        }

        // Get user rating using handle
        const profileResponse = await fetch(`/api/codeforces/profile?handle=${handle}`);
        const profileData = await profileResponse.json();
        const rating = profileData.user?.rating || 1500;
        setUserRating(rating);

        // Fetch problems with rating filter
        const response = await fetch(`/api/codeforces/problems?rating=${rating}`);
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
        
        // Try to sync solved problems
        try {
          await syncSolvedProblems(handle);
        } catch (syncError) {
          // If sync fails, fall back to localStorage
          const savedSolved = localStorage.getItem('codeforcesProblems');
          if (savedSolved) {
            setSolvedProblems(new Set(JSON.parse(savedSolved)));
          }
          console.error('Failed to sync solved problems:', syncError);
        }

        // Generate daily practice problems
        const dailyPractice = {
          easier: data.problems.find(p => p.rating >= rating - 100 && p.rating < rating),
          onLevel: data.problems.find(p => p.rating === rating),
          harder: data.problems.find(p => p.rating > rating && p.rating <= rating + 100)
        };

        // If exact rating match not found for onLevel, find closest
        if (!dailyPractice.onLevel) {
          const closestToRating = data.problems.find(p => 
            p.rating >= rating - 50 && p.rating <= rating + 50 && 
            !solvedProblems.has(p.id)
          );
          if (closestToRating) {
            dailyPractice.onLevel = closestToRating;
          }
        }

        // Ensure we get unsolved problems if available
        if (dailyPractice.easier && solvedProblems.has(dailyPractice.easier.id)) {
          dailyPractice.easier = data.problems.find(p => 
            p.rating >= rating - 100 && p.rating < rating && 
            !solvedProblems.has(p.id)
          );
        }

        if (dailyPractice.harder && solvedProblems.has(dailyPractice.harder.id)) {
          dailyPractice.harder = data.problems.find(p => 
            p.rating > rating && p.rating <= rating + 100 && 
            !solvedProblems.has(p.id)
          );
        }

        setDailyProblems(dailyPractice);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserAndProblems();
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
  
  // Modified toggle solved status to sync with Codeforces
  const handleToggleSolved = async (problemId) => {
    // We'll only allow marking problems as solved if they're actually solved on Codeforces
    const handle = localStorage.getItem('codeforcesHandle');
    if (!handle) {
      alert('Please set your Codeforces handle first');
      return;
    }

    try {
      await syncSolvedProblems(handle);
    } catch (error) {
      alert('Failed to sync with Codeforces. Please try again later.');
    }
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
  
  // Get rating-wise progress
  const getRatingProgress = () => {
    const progress = {};
    const maxRating = userRating + 300;
    
    // Initialize progress for each rating
    for (let rating = 800; rating <= maxRating; rating += 100) {
      progress[rating] = {
        total: 0,
        solved: 0
      };
    }
    
    problems.forEach(problem => {
      const rating = problem.rating;
      if (rating && rating <= maxRating) {
        // Round down to nearest hundred
        const roundedRating = Math.floor(rating / 100) * 100;
        if (!progress[roundedRating]) {
          progress[roundedRating] = { total: 0, solved: 0 };
        }
        progress[roundedRating].total++;
        if (solvedProblems.has(problem.id)) {
          progress[roundedRating].solved++;
        }
      }
    });
    
    return progress;
  };

  // Get total progress
  const getTotalProgress = () => {
    const maxRating = userRating + 300;
    let total = 0;
    let solved = 0;
    
    problems.forEach(problem => {
      if (problem.rating && problem.rating <= maxRating) {
        total++;
        if (solvedProblems.has(problem.id)) {
          solved++;
        }
      }
    });
    
    return { total, solved };
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Codeforces Problem Set</h1>
        <div className="text-gray-600 dark:text-gray-300">
          Your Rating: {userRating}
        </div>
      </div>

      {/* Add Sync Button */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => syncSolvedProblems(localStorage.getItem('codeforcesHandle'))}
          disabled={syncLoading}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {syncLoading ? 'Syncing...' : 'Sync with Codeforces'}
        </button>
        {lastSyncTime && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last synced: {new Date(lastSyncTime).toLocaleString()}
          </div>
        )}
      </div>

      {/* Daily Practice Section */}
      {dailyProblems && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Daily Practice</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Problems within ±100 of your rating ({userRating})
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyProblems.easier && (
              <CodeforcesProblemCard 
                problem={dailyProblems.easier}
                solved={solvedProblems.has(dailyProblems.easier.id)}
                onSolvedToggle={handleToggleSolved}
                label={`Practice (Rating ${dailyProblems.easier.rating})`}
              />
            )}
            {dailyProblems.onLevel && (
              <CodeforcesProblemCard 
                problem={dailyProblems.onLevel}
                solved={solvedProblems.has(dailyProblems.onLevel.id)}
                onSolvedToggle={handleToggleSolved}
                label={`On Your Level (Rating ${dailyProblems.onLevel.rating})`}
              />
            )}
            {dailyProblems.harder && (
              <CodeforcesProblemCard 
                problem={dailyProblems.harder}
                solved={solvedProblems.has(dailyProblems.harder.id)}
                onSolvedToggle={handleToggleSolved}
                label={`Challenge (Rating ${dailyProblems.harder.rating})`}
              />
            )}
          </div>
        </div>
      )}
      <button
        onClick={() => router.push('/dashboard/codeforces/profile')}
        className="mt-2 md:mt-0 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Back to Profile
      </button>
      
      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Rating-wise Progress</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Up to rating {userRating + 300}
          </div>
        </div>

        {/* Total Progress */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-md font-medium text-gray-700 dark:text-gray-300">Total Progress</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {getTotalProgress().total > 0 
                ? Math.round((getTotalProgress().solved / getTotalProgress().total) * 100) 
                : 0}%
            </div>
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {getTotalProgress().solved}/{getTotalProgress().total} Problems
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${getTotalProgress().total > 0 
                  ? (getTotalProgress().solved / getTotalProgress().total) * 100 
                  : 0}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Rating Progress Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Object.entries(getRatingProgress()).map(([rating, stats]) => (
            stats.total > 0 && (
              <div key={rating} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Rating {rating}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round((stats.solved / stats.total) * 100)}%
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {stats.solved}/{stats.total}
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.solved / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )
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
              Rating
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <optgroup label="Newbie (Gray)">
                <option value="800-800">800</option>
                <option value="900-900">900</option>
                <option value="1000-1000">1000</option>
                <option value="1100-1100">1100</option>
                <option value="1199-1199">1199</option>
              </optgroup>
              <optgroup label="Pupil (Green)">
                <option value="1200-1200">1200</option>
                <option value="1300-1300">1300</option>
                <option value="1400-1400">1400</option>
                <option value="1499-1499">1499</option>
              </optgroup>
              <optgroup label="Specialist (Cyan)">
                <option value="1500-1500">1500</option>
                <option value="1600-1600">1600</option>
                <option value="1700-1700">1700</option>
                <option value="1799-1799">1799</option>
              </optgroup>
              <optgroup label="Expert (Blue)">
                <option value="1800-1800">1800</option>
                <option value="1900-1900">1900</option>
                <option value="2000-2000">2000</option>
                <option value="2099-2099">2099</option>
              </optgroup>
              <optgroup label="Candidate Master (Purple)">
                <option value="2100-2100">2100</option>
                <option value="2200-2200">2200</option>
                <option value="2300-2300">2300</option>
                <option value="2399-2399">2399</option>
              </optgroup>
              <optgroup label="Master (Orange)">
                <option value="2400-2400">2400</option>
                <option value="2500-2500">2500</option>
                <option value="2599-2599">2599</option>
              </optgroup>
              <optgroup label="International Master (Orange)">
                <option value="2600-2600">2600</option>
                <option value="2700-2700">2700</option>
                <option value="2799-2799">2799</option>
              </optgroup>
              <optgroup label="Grandmaster (Red)">
                <option value="2800-2800">2800</option>
                <option value="2900-2900">2900</option>
                <option value="3000-3000">3000</option>
                <option value="3500-3500">3500</option>
              </optgroup>
              <optgroup label="Rating Ranges">
                <option value="800-1199">All Newbie (800-1199)</option>
                <option value="1200-1499">All Pupil (1200-1499)</option>
                <option value="1500-1799">All Specialist (1500-1799)</option>
                <option value="1800-2099">All Expert (1800-2099)</option>
                <option value="2100-2399">All Candidate Master (2100-2399)</option>
                <option value="2400-2599">All Master (2400-2599)</option>
                <option value="2600-2799">All International Master (2600-2799)</option>
                <option value="2800-3500">All Grandmaster (2800+)</option>
              </optgroup>
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