import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

def identify_critical_topics(problems, solved_problems):
    """
    Identify critical topics for the user to focus on based on their performance.
    
    Args:
        problems: List of all problem objects
        solved_problems: List of user's solved problem objects
    
    Returns:
        List of critical topics with their stats
    """
    if not problems or not solved_problems:
        return []
    
    # Convert to pandas DataFrame for easier manipulation
    problems_df = pd.DataFrame(problems)
    solved_df = pd.DataFrame(solved_problems)
    
    # Create a dictionary to store problem lookup by ID
    problem_dict = {str(p.get('id', p.get('_id', None))): p for p in problems}
    
    # Extract topics from all problems
    all_topics = problems_df['topic'].unique()
    
    # Calculate topic statistics
    topic_stats = []
    for topic in all_topics:
        # Count total problems in this topic
        topic_problems = problems_df[problems_df['topic'] == topic]
        total = len(topic_problems)
        
        # Count how many of these problems the user has solved
        solved_problem_ids = [str(sp.get('problemId')) for sp in solved_problems]
        solved_topic_problems = [p for p in topic_problems.to_dict('records') 
                              if str(p.get('id', p.get('_id', None))) in solved_problem_ids]
        solved = len(solved_topic_problems)
        
        # Calculate completion rate
        completion_rate = (solved / total * 100) if total > 0 else 0
        
        # Calculate average time spent (if available)
        times = []
        for sp in solved_problems:
            problem_id = str(sp.get('problemId'))
            if problem_id in problem_dict and problem_dict[problem_id].get('topic') == topic:
                if 'timeSpent' in sp:
                    times.append(sp['timeSpent'])
        
        avg_time = sum(times) / len(times) if times else 0
        
        topic_stats.append({
            'topic': topic,
            'totalProblems': total,
            'solvedProblems': solved,
            'completionRate': completion_rate,
            'avgTimeMinutes': avg_time
        })
    
    # Convert to DataFrame
    stats_df = pd.DataFrame(topic_stats)
    
    if len(stats_df) == 0:
        return []
    
    # Calculate overall averages
    overall_completion = stats_df['completionRate'].mean()
    stats_with_time = stats_df[stats_df['solvedProblems'] > 0]
    overall_time = stats_with_time['avgTimeMinutes'].mean() if len(stats_with_time) > 0 else 0
    
    # Use machine learning to cluster topics by performance
    if len(stats_df) >= 3:  # Need at least 3 data points for meaningful clustering
        # Prepare data for clustering
        X = stats_df[['completionRate', 'avgTimeMinutes']].fillna(0).values
        
        # Scale the data (important for KMeans)
        X_scaled = np.zeros_like(X)
        # Avoid division by zero
        if X[:, 0].std() > 0:
            X_scaled[:, 0] = (X[:, 0] - X[:, 0].mean()) / X[:, 0].std()
        if X[:, 1].std() > 0:
            X_scaled[:, 1] = (X[:, 1] - X[:, 1].mean()) / X[:, 1].std()
        
        # Apply KMeans clustering with 2 clusters (good and bad performance)
        kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(X_scaled)
        
        # Determine which cluster represents poor performance
        # Lower completion rate and higher time = poor performance
        cluster_centers = kmeans.cluster_centers_
        # If the first dimension (completion rate) of cluster 0 is lower than cluster 1,
        # or if they're similar but the second dimension (time) is higher, then cluster 0 is worse
        if (cluster_centers[0][0] < cluster_centers[1][0]) or \
           (abs(cluster_centers[0][0] - cluster_centers[1][0]) < 0.5 and cluster_centers[0][1] > cluster_centers[1][1]):
            poor_cluster = 0
        else:
            poor_cluster = 1
        
        # Add cluster info to stats
        stats_df['cluster'] = clusters
        
        # Filter to critical topics (in the poor performance cluster)
        critical_df = stats_df[stats_df['cluster'] == poor_cluster]
    else:
        # If not enough data for clustering, use simple heuristics
        critical_df = stats_df[
            (stats_df['completionRate'] < overall_completion * 0.7) | 
            (stats_df['completionRate'] < 30)
        ]
    
    # Add critical score (lower completion % and higher time = higher score)
    critical_df['criticalScore'] = (100 - critical_df['completionRate']) + (critical_df['avgTimeMinutes'] / 10)
    
    # Sort by critical score and take top 5
    critical_df = critical_df.sort_values('criticalScore', ascending=False).head(5)
    
    # Generate reasons for why topics are critical
    critical_topics = []
    for _, row in critical_df.iterrows():
        topic = row['topic']
        solved = int(row['solvedProblems'])
        total = int(row['totalProblems'])
        completion = round(row['completionRate'])
        avg_time = round(row['avgTimeMinutes'])
        
        if solved == 0:
            reason = f"You haven't solved any problems in this topic yet."
        elif completion < 30:
            reason = f"Low completion rate ({completion}%)."
        elif avg_time > overall_time * 1.2:
            reason = f"Takes longer than average to solve ({avg_time} mins vs. {round(overall_time)} mins average)."
        else:
            reason = f"Below average completion rate compared to other topics."
        
        critical_topics.append({
            'name': topic,
            'solved': solved,
            'total': total,
            'completionRate': completion,
            'averageTime': avg_time,
            'reason': reason,
            'criticalScore': round(row['criticalScore'], 2)
        })
    
    return critical_topics
