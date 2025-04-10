import axios from 'axios';

/**
 * Base URL for Codeforces API
 */
const API_BASE_URL = 'https://codeforces.com/api';

/**
 * Get user information from Codeforces API
 * @param {string} handle - Codeforces handle/username
 * @returns {Promise<Object>} - User information
 */
export async function getUserInfo(handle) {
  try {
    const response = await axios.get(`${API_BASE_URL}/user.info`, {
      params: { handles: handle }
    });
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        user: response.data.result[0]
      };
    } else {
      return {
        success: false,
        error: 'Unable to fetch user information'
      };
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return {
      success: false,
      error: error.response?.data?.comment || 'Network error'
    };
  }
}

/**
 * Get user's submission statistics from Codeforces API
 * @param {string} handle - Codeforces handle/username
 * @returns {Promise<Object>} - Submission statistics
 */
export async function getUserSubmissions(handle) {
  try {
    const response = await axios.get(`${API_BASE_URL}/user.status`, {
      params: { handle, from: 1, count: 100 }
    });
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        submissions: response.data.result
      };
    } else {
      return {
        success: false,
        error: 'Unable to fetch submissions'
      };
    }
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return {
      success: false,
      error: error.response?.data?.comment || 'Network error'
    };
  }
}

/**
 * Get user's contest rating history from Codeforces API
 * @param {string} handle - Codeforces handle/username
 * @returns {Promise<Object>} - Rating history
 */
export async function getUserRatingHistory(handle) {
  try {
    const response = await axios.get(`${API_BASE_URL}/user.rating`, {
      params: { handle }
    });
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        ratingHistory: response.data.result
      };
    } else {
      return {
        success: false,
        error: 'Unable to fetch rating history'
      };
    }
  } catch (error) {
    console.error('Error fetching user rating history:', error);
    return {
      success: false,
      error: error.response?.data?.comment || 'Network error'
    };
  }
}

/**
 * Get problem set from Codeforces API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Problem set data
 */
export async function getProblemSet(params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}/problemset.problems`, {
      params
    });
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        problems: response.data.result.problems,
        problemStatistics: response.data.result.problemStatistics
      };
    } else {
      return {
        success: false,
        error: 'Unable to fetch problem set'
      };
    }
  } catch (error) {
    console.error('Error fetching problem set:', error);
    return {
      success: false,
      error: error.response?.data?.comment || 'Network error'
    };
  }
}

/**
 * Filter and curate a list of 100 good problems from different difficulty levels
 * @returns {Promise<Array>} - Curated problem list
 */
export async function getCuratedProblemList() {
  try {
    const { success, problems, error } = await getProblemSet();
    
    if (!success) {
      throw new Error(error);
    }
    
    // Filter out problems without ratings
    const ratedProblems = problems.filter(p => p.rating);
    
    // Group by difficulty ranges
    const difficultyRanges = {
      beginner: [800, 1200],
      easy: [1200, 1500],
      medium: [1500, 1800],
      hard: [1800, 2100],
      expert: [2100, 2500],
      master: [2500, 3500]
    };
    
    const groupedProblems = {};
    
    Object.entries(difficultyRanges).forEach(([level, [min, max]]) => {
      groupedProblems[level] = ratedProblems.filter(p => 
        p.rating >= min && p.rating < max
      );
    });
    
    // Select a balanced distribution of problems
    const distribution = {
      beginner: 15,
      easy: 20,
      medium: 25,
      hard: 20,
      expert: 15,
      master: 5
    };
    
    // Randomly select problems from each difficulty range
    const curatedList = [];
    
    Object.entries(distribution).forEach(([level, count]) => {
      const problemsInRange = groupedProblems[level];
      
      // If we don't have enough problems in this range, take all of them
      if (problemsInRange.length <= count) {
        curatedList.push(...problemsInRange);
      } else {
        // Randomly select 'count' problems
        const selectedIndices = new Set();
        while (selectedIndices.size < count) {
          const randomIndex = Math.floor(Math.random() * problemsInRange.length);
          selectedIndices.add(randomIndex);
        }
        
        selectedIndices.forEach(index => {
          curatedList.push(problemsInRange[index]);
        });
      }
    });
    
    // Add URL and format the problems
    return curatedList.map(problem => ({
      id: `${problem.contestId}${problem.index}`,
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      rating: problem.rating,
      tags: problem.tags,
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
    }));
  } catch (error) {
    console.error('Error creating curated problem list:', error);
    return [];
  }
}

/**
 * Analyze user performance based on submissions
 * @param {string} handle - Codeforces handle/username
 * @returns {Promise<Object>} - Analysis data
 */
export async function analyzeUserPerformance(handle) {
  try {
    // Fetch user submissions
    const { success, submissions, error } = await getUserSubmissions(handle);
    
    if (!success) {
      throw new Error(error);
    }
    
    // Filter accepted submissions only
    const acceptedSubmissions = submissions.filter(
      sub => sub.verdict === 'OK'
    );
    
    // Get unique solved problems
    const solvedProblems = new Set();
    const problemDetails = {};
    const tagFrequency = {};
    const levelFrequency = {};
    
    acceptedSubmissions.forEach(submission => {
      const problemId = `${submission.problem.contestId}${submission.problem.index}`;
      
      if (!solvedProblems.has(problemId)) {
        solvedProblems.add(problemId);
        problemDetails[problemId] = submission.problem;
        
        // Count tag frequency
        submission.problem.tags.forEach(tag => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
        
        // Count difficulty level frequency
        const rating = submission.problem.rating;
        if (rating) {
          const level = getRatingLevel(rating);
          levelFrequency[level] = (levelFrequency[level] || 0) + 1;
        }
      }
    });
    
    // Sort tags by frequency
    const sortedTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({
        tag,
        count,
        percentage: Math.round((count / solvedProblems.size) * 100)
      }));
    
    // Prepare distribution by difficulty level
    const levelDistribution = Object.entries(levelFrequency)
      .map(([level, count]) => ({
        level,
        count,
        percentage: Math.round((count / solvedProblems.size) * 100)
      }))
      .sort((a, b) => getLevelSortValue(a.level) - getLevelSortValue(b.level));
    
    return {
      solvedCount: solvedProblems.size,
      strongTags: sortedTags.slice(0, 5),
      weakTags: sortedTags.slice(-5).reverse(),
      levelDistribution
    };
  } catch (error) {
    console.error('Error analyzing user performance:', error);
    return {
      solvedCount: 0,
      strongTags: [],
      weakTags: [],
      levelDistribution: []
    };
  }
}

// Helper function to determine rating level
function getRatingLevel(rating) {
  if (rating < 1200) return 'Newbie';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2100) return 'Candidate Master';
  if (rating < 2400) return 'Master';
  if (rating < 2600) return 'International Master';
  if (rating < 3000) return 'Grandmaster';
  return 'International Grandmaster';
}

// Helper function to sort levels
function getLevelSortValue(level) {
  const levels = [
    'Newbie',
    'Pupil',
    'Specialist',
    'Expert',
    'Candidate Master',
    'Master',
    'International Master',
    'Grandmaster',
    'International Grandmaster'
  ];
  
  return levels.indexOf(level);
}