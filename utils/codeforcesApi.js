import axios from 'axios';

/**
 * Base URL for Codeforces API
 */
const CF_API_BASE = 'https://codeforces.com/api';

/**
 * Get user information from Codeforces API
 * @param {string} handle - Codeforces handle/username
 * @returns {Promise<Object>} - User information
 */
export async function getUserInfo(handle) {
  try {
    const response = await axios.get(`${CF_API_BASE}/user.info?handles=${handle}`);
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        user: response.data.result[0]
      };
    }
    
    return {
      success: false,
      error: 'Could not fetch user information'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.comment || 'Error fetching user data'
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
    const response = await axios.get(`${CF_API_BASE}/user.status?handle=${handle}&from=1&count=100`);
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        submissions: response.data.result
      };
    }
    
    return {
      success: false,
      error: 'Could not fetch user submissions'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.comment || 'Error fetching submissions'
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
    const response = await axios.get(`${CF_API_BASE}/user.rating?handle=${handle}`);
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        contests: response.data.result
      };
    }
    
    return {
      success: false,
      error: 'Could not fetch rating history'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.comment || 'Error fetching rating history'
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
    const response = await axios.get(`${CF_API_BASE}/problemset.problems`, { params });
    
    if (response.data.status === 'OK') {
      return {
        success: true,
        problems: response.data.result.problems,
        problemStatistics: response.data.result.problemStatistics
      };
    }
    
    return {
      success: false,
      error: 'Could not fetch problem set'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.comment || 'Error fetching problem set'
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
      return { success: false, error };
    }
    
    // Filter out problems without a rating (difficulty)
    const ratedProblems = problems.filter(p => p.rating);
    
    // Group problems by rating
    const groupedByRating = {};
    ratedProblems.forEach(problem => {
      if (!groupedByRating[problem.rating]) {
        groupedByRating[problem.rating] = [];
      }
      groupedByRating[problem.rating].push(problem);
    });
    
    // Get curated problems from different rating ranges
    const curated = [];
    const ratingRanges = [
      { min: 800, max: 1000, count: 15 },   // Beginner
      { min: 1100, max: 1300, count: 20 },  // Easy
      { min: 1400, max: 1600, count: 25 },  // Medium
      { min: 1700, max: 1900, count: 20 },  // Hard
      { min: 2000, max: 2400, count: 15 },  // Advanced
      { min: 2500, max: 3500, count: 5 }    // Expert
    ];
    
    ratingRanges.forEach(range => {
      const problemsInRange = ratedProblems.filter(p => 
        p.rating >= range.min && p.rating <= range.max
      );
      
      // Add a subset of problems from this range to the curated list
      const selectedFromRange = problemsInRange
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, range.count);
        
      curated.push(...selectedFromRange);
    });
    
    return { 
      success: true, 
      problems: curated.slice(0, 100) 
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error creating curated problem list'
    };
  }
}

/**
 * Analyze user performance based on submissions
 * @param {string} handle - Codeforces handle/username
 * @returns {Promise<Object>} - Analysis data
 */
export async function analyzeUserPerformance(handle) {
  try {
    const [userInfoResponse, submissionsResponse, ratingResponse] = await Promise.all([
      getUserInfo(handle),
      getUserSubmissions(handle),
      getUserRatingHistory(handle)
    ]);
    
    if (!userInfoResponse.success) {
      return userInfoResponse;
    }
    
    const user = userInfoResponse.user;
    const submissions = submissionsResponse.success ? submissionsResponse.submissions : [];
    const ratingHistory = ratingResponse.success ? ratingResponse.contests : [];
    
    // Count solved problems (distinct)
    const solvedProblems = new Set();
    const submissionsByVerdict = {};
    const submissionsByTag = {};
    
    submissions.forEach(submission => {
      // Count by verdict
      const verdict = submission.verdict || 'UNKNOWN';
      submissionsByVerdict[verdict] = (submissionsByVerdict[verdict] || 0) + 1;
      
      // Track solved problems
      if (verdict === 'OK') {
        const problemId = `${submission.problem.contestId}${submission.problem.index}`;
        solvedProblems.add(problemId);
        
        // Count by tag
        if (submission.problem.tags) {
          submission.problem.tags.forEach(tag => {
            submissionsByTag[tag] = (submissionsByTag[tag] || 0) + 1;
          });
        }
      }
    });
    
    return {
      success: true,
      user,
      stats: {
        rating: user.rating,
        maxRating: user.maxRating,
        rank: user.rank,
        solvedCount: solvedProblems.size,
        submissionCount: submissions.length,
        submissionsByVerdict,
        submissionsByTag,
        ratingHistory: ratingHistory.map(contest => ({
          contestId: contest.contestId,
          contestName: contest.contestName,
          rank: contest.rank,
          oldRating: contest.oldRating,
          newRating: contest.newRating,
          ratingChange: contest.newRating - contest.oldRating
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error analyzing user performance'
    };
  }
}