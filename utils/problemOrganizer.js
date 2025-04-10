/**
 * Organize problems by topic and difficulty
 * @param {Array} problems - Array of problem objects
 * @returns {Object} - Nested object of problems organized by topic and difficulty
 */
export function organizeByTopicAndDifficulty(problems) {
  const organized = {};
  
  problems.forEach(problem => {
    const topic = problem.topic || 'Uncategorized';
    const difficulty = problem.difficulty?.toLowerCase() || 'medium';
    
    // Initialize topic if it doesn't exist
    if (!organized[topic]) {
      organized[topic] = {
        easy: [],
        medium: [],
        hard: []
      };
    }
    
    // Add problem to the appropriate difficulty array
    organized[topic][difficulty].push(problem);
  });
  
  return organized;
}

/**
 * Find critical topic problems that are unsolved
 * @param {Array} problems - All problems
 * @param {Array} solvedProblems - Solved problem IDs
 * @param {Array} criticalTopics - Critical topics array
 * @returns {Object} - Object containing critical topic problems
 */
export function getUnsolvedCriticalProblems(problems, solvedProblems, criticalTopics) {
  // Create set of solved problem IDs for faster lookup
  const solvedIds = new Set(solvedProblems);
  
  // Extract critical topic names
  const criticalTopicNames = criticalTopics.map(topic => topic.name);
  
  // Filter problems
  const criticalProblems = problems.filter(problem => 
    !solvedIds.has(problem.id) && 
    criticalTopicNames.includes(problem.topic)
  );
  
  // Organize by topic
  const organized = {};
  
  criticalProblems.forEach(problem => {
    const topic = problem.topic;
    
    if (!organized[topic]) {
      organized[topic] = [];
    }
    
    organized[topic].push(problem);
  });
  
  return organized;
}

/**
 * Get top critical problems for revision
 * @param {Array} problems - All problems
 * @param {Array} solvedProblems - Solved problem objects
 * @param {Array} criticalTopics - Critical topics array
 * @param {Number} count - Number of problems to return (default: 5)
 * @returns {Array} - Array of critical problems for revision
 */
export function getRevisionProblems(problems, solvedProblems, criticalTopics, count = 5) {
  // Extract critical topic names and sort by priority
  const sortedCriticalTopics = [...criticalTopics].sort((a, b) => 
    (b.completionRate - a.completionRate) // Sort by lowest completion rate first
  );
  
  // Get solved problem IDs
  const solvedIds = solvedProblems.map(p => p.id);
  
  // Get problems from critical topics that have been solved
  const criticalSolvedProblems = solvedProblems.filter(problem => 
    sortedCriticalTopics.some(topic => topic.name === problem.topic)
  );
  
  // Prioritize problems by topic importance and recency (not too recent, not too old)
  const prioritizedProblems = criticalSolvedProblems.sort((a, b) => {
    // Get topic priority (lower index = higher priority)
    const topicAPriority = sortedCriticalTopics.findIndex(t => t.name === a.topic);
    const topicBPriority = sortedCriticalTopics.findIndex(t => t.name === b.topic);
    
    // If topics have different priorities, sort by that
    if (topicAPriority !== topicBPriority) {
      return topicAPriority - topicBPriority;
    }
    
    // Otherwise sort by solve date (prioritize problems solved 1-4 weeks ago)
    const now = new Date();
    const solveTimeA = new Date(a.solvedAt);
    const solveTimeB = new Date(b.solvedAt);
    
    const daysAgoA = Math.floor((now - solveTimeA) / (1000 * 60 * 60 * 24));
    const daysAgoB = Math.floor((now - solveTimeB) / (1000 * 60 * 60 * 24));
    
    // Calculate a "revision score" - problems from 7-28 days ago get highest score
    const getRevisionScore = days => {
      if (days < 7) return days; // Too recent, lower score
      if (days < 28) return 100 - (days - 7); // Sweet spot, higher score
      return 100 - (days); // Too old, lower score
    };
    
    return getRevisionScore(daysAgoB) - getRevisionScore(daysAgoA);
  });
  
  return prioritizedProblems.slice(0, count);
}

/**
 * Generate daily practice problems from Codeforces based on user rating
 * @param {Array} problems - Array of Codeforces problems
 * @param {Number} userRating - User's Codeforces rating
 * @param {Set} solvedProblems - Set of solved problem IDs
 * @returns {Object} - Object containing practice problems
 */
export function getDailyCodeforcesProblems(problems, userRating, solvedProblems) {
  // If no rating, use 1500 as default
  const rating = userRating || 1500;
  
  // Filter out solved problems
  const unsolvedProblems = problems.filter(p => !solvedProblems.has(p.id));
  
  // Prepare result object
  const result = {
    easier: null,
    onLevel: null,
    harder: null
  };
  
  // Define rating ranges
  const easierMin = Math.max(800, rating - 300);
  const easierMax = rating - 100;
  const onLevelMin = rating - 100;
  const onLevelMax = rating + 100;
  const harderMin = rating + 100;
  const harderMax = rating + 300;
  
  // Filter problems by rating ranges
  const easierProblems = unsolvedProblems.filter(p => 
    p.rating >= easierMin && p.rating <= easierMax
  );
  
  const onLevelProblems = unsolvedProblems.filter(p => 
    p.rating >= onLevelMin && p.rating <= onLevelMax
  );
  
  const harderProblems = unsolvedProblems.filter(p => 
    p.rating >= harderMin && p.rating <= harderMax
  );
  
  // Select random problems from each category, prioritizing newer problems
  const getRandomProblem = (problemList) => {
    if (problemList.length === 0) return null;
    
    // Sort by contestId (higher = newer)
    const sorted = [...problemList].sort((a, b) => b.contestId - a.contestId);
    
    // Take the top 30% newest problems to choose from
    const newestProblems = sorted.slice(0, Math.max(1, Math.floor(sorted.length * 0.3)));
    
    // Pick a random problem from the newest subset
    const randomIndex = Math.floor(Math.random() * newestProblems.length);
    return newestProblems[randomIndex];
  };
  
  result.easier = getRandomProblem(easierProblems);
  result.onLevel = getRandomProblem(onLevelProblems);
  result.harder = getRandomProblem(harderProblems);
  
  return result;
}