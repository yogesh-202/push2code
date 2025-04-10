/**
 * Group problems by topic
 * @param {Array} problems - Array of problem objects
 * @returns {Object} - Object with topics as keys and arrays of problems as values
 */
export function groupProblemsByTopic(problems) {
  return problems.reduce((acc, problem) => {
    const topic = problem.topic || 'Other';
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(problem);
    return acc;
  }, {});
}

/**
 * Group problems by difficulty
 * @param {Array} problems - Array of problem objects
 * @returns {Object} - Object with difficulties as keys and arrays of problems as values
 */
export function groupProblemsByDifficulty(problems) {
  return problems.reduce((acc, problem) => {
    const difficulty = problem.difficulty || 'Medium';
    if (!acc[difficulty]) {
      acc[difficulty] = [];
    }
    acc[difficulty].push(problem);
    return acc;
  }, {});
}

/**
 * Calculate topic statistics from solved problems
 * @param {Array} problems - All problems
 * @param {Array} solvedProblems - Solved problems
 * @returns {Array} - Array of topic statistics
 */
export function calculateTopicStats(problems, solvedProblems) {
  // Get all unique topics
  const topics = [...new Set(problems.map(p => p.topic))];
  
  // For each topic, calculate statistics
  return topics.map(topic => {
    const topicProblems = problems.filter(p => p.topic === topic);
    const solvedTopicProblems = solvedProblems.filter(sp => {
      const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
      return problem && problem.topic === topic;
    });
    
    // Calculate average time spent on this topic
    const avgTime = solvedTopicProblems.length > 0
      ? solvedTopicProblems.reduce((sum, sp) => sum + sp.timeSpent, 0) / solvedTopicProblems.length
      : 0;
    
    // Calculate completion percentage
    const completionRate = topicProblems.length > 0
      ? (solvedTopicProblems.length / topicProblems.length) * 100
      : 0;
    
    return {
      topic,
      totalProblems: topicProblems.length,
      solvedProblems: solvedTopicProblems.length,
      avgTimeMinutes: Math.round(avgTime),
      completionRate: Math.round(completionRate),
    };
  });
}

/**
 * Find critical topics based on completion rate and average time
 * @param {Array} topicStats - Array of topic statistics
 * @returns {Array} - Array of critical topics
 */
export function findCriticalTopics(topicStats) {
  if (!topicStats || topicStats.length === 0) {
    return [];
  }
  
  // Calculate overall average completion rate
  const avgCompletionRate = topicStats.reduce((sum, stat) => sum + stat.completionRate, 0) / topicStats.length;
  
  // Calculate overall average time for solved problems
  const statsWithTime = topicStats.filter(stat => stat.solvedProblems > 0);
  const avgTime = statsWithTime.length > 0
    ? statsWithTime.reduce((sum, stat) => sum + stat.avgTimeMinutes, 0) / statsWithTime.length
    : 0;
  
  // Find topics with below average completion rate or above average time
  return topicStats
    .filter(stat => 
      (stat.completionRate < avgCompletionRate * 0.7 || stat.completionRate < 30) && 
      stat.totalProblems > 0
    )
    .map(stat => {
      let reason = '';
      
      if (stat.solvedProblems === 0) {
        reason = `You haven't solved any problems in this topic yet.`;
      } else if (stat.completionRate < 30) {
        reason = `Low completion rate (${stat.completionRate}%).`;
      } else if (stat.avgTimeMinutes > avgTime * 1.2) {
        reason = `Takes longer than average to solve (${stat.avgTimeMinutes} mins vs. ${Math.round(avgTime)} mins average).`;
      } else {
        reason = `Below average completion rate compared to other topics.`;
      }
      
      return {
        name: stat.topic,
        solved: stat.solvedProblems,
        total: stat.totalProblems,
        completionRate: stat.completionRate,
        averageTime: stat.avgTimeMinutes,
        reason,
        criticalScore: (100 - stat.completionRate) + (stat.avgTimeMinutes / 10)
      };
    })
    .sort((a, b) => b.criticalScore - a.criticalScore);
}
