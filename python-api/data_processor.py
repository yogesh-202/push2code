import pandas as pd
import numpy as np
from collections import defaultdict
from datetime import datetime, timedelta

def process_user_data(solved_problems):
    """
    Process user's solved problems data to extract useful statistics.
    
    Args:
        solved_problems: List of user's solved problem objects
    
    Returns:
        Dictionary containing user statistics
    """
    if not solved_problems:
        return {
            "totalSolved": 0,
            "averageTime": 0,
            "consistencyScore": 0,
            "streakDays": 0,
            "timeDistribution": []
        }
    
    # Convert to DataFrame
    df = pd.DataFrame(solved_problems)
    
    # Ensure we have the necessary columns
    if 'solvedAt' not in df.columns:
        df['solvedAt'] = pd.Timestamp.now()
    if 'timeSpent' not in df.columns:
        df['timeSpent'] = 0
        
    # Convert solvedAt to datetime
    df['solvedAt'] = pd.to_datetime(df['solvedAt'])
    
    # Calculate total problems solved
    total_solved = len(df)
    
    # Calculate average time spent
    average_time = df['timeSpent'].mean() if 'timeSpent' in df.columns else 0
    
    # Calculate consistency score (problems solved per day in the last 30 days)
    last_30_days = pd.date_range(end=datetime.now(), periods=30, freq='D')
    problems_per_day = df[df['solvedAt'] >= last_30_days[0]].groupby(df['solvedAt'].dt.date).size()
    days_with_problems = len(problems_per_day)
    consistency_score = days_with_problems / 30 * 100  # As a percentage
    
    # Calculate current streak
    sorted_dates = sorted(df['solvedAt'].dt.date.unique())
    if not sorted_dates:
        streak_days = 0
    else:
        streak_days = 1
        today = pd.Timestamp.now().date()
        
        # Check if there's a problem solved today
        if sorted_dates[-1] == today:
            # Count consecutive days going backward from today
            current_date = today - timedelta(days=1)
            for date in reversed(sorted_dates[:-1]):  # Skip today which we've already checked
                if date == current_date:
                    streak_days += 1
                    current_date -= timedelta(days=1)
                else:
                    break
        else:
            # If no problem solved today, check for consecutive days in the past
            for i in range(1, len(sorted_dates)):
                if (sorted_dates[i] - sorted_dates[i-1]).days == 1:
                    streak_days += 1
                else:
                    streak_days = 1  # Reset streak if gap found
    
    # Calculate time distribution (when user solves problems)
    if 'solvedAt' in df.columns:
        hour_distribution = df['solvedAt'].dt.hour.value_counts().sort_index()
        time_distribution = [
            {"hour": hour, "count": int(count)} 
            for hour, count in hour_distribution.items()
        ]
    else:
        time_distribution = []
    
    return {
        "totalSolved": total_solved,
        "averageTime": round(average_time, 1),
        "consistencyScore": round(consistency_score, 1),
        "streakDays": streak_days,
        "timeDistribution": time_distribution
    }

def analyze_topic_performance(problems, solved_problems):
    """
    Analyze user's performance by topic.
    
    Args:
        problems: List of all problem objects
        solved_problems: List of user's solved problem objects
    
    Returns:
        List of topic performance statistics
    """
    if not problems or not solved_problems:
        return []
    
    # Create problem lookup dictionary
    problem_dict = {str(p.get('id', p.get('_id', None))): p for p in problems}
    
    # Group solved problems by topic
    topic_performance = defaultdict(lambda: {
        'topic': '',
        'solvedProblems': 0,
        'totalProblems': 0,
        'avgTime': 0,
        'totalTime': 0,
        'easy': 0,
        'medium': 0,
        'hard': 0
    })
    
    # Count total problems per topic
    for p in problems:
        topic = p.get('topic', 'Other')
        difficulty = p.get('difficulty', 'Medium').lower()
        
        topic_performance[topic]['topic'] = topic
        topic_performance[topic]['totalProblems'] += 1
        
        if difficulty == 'easy':
            topic_performance[topic]['easy'] += 1
        elif difficulty == 'medium':
            topic_performance[topic]['medium'] += 1
        elif difficulty == 'hard':
            topic_performance[topic]['hard'] += 1
    
    # Process solved problems
    for sp in solved_problems:
        problem_id = str(sp.get('problemId'))
        if problem_id in problem_dict:
            topic = problem_dict[problem_id].get('topic', 'Other')
            time_spent = sp.get('timeSpent', 0)
            
            topic_performance[topic]['solvedProblems'] += 1
            topic_performance[topic]['totalTime'] += time_spent
    
    # Calculate averages and completion rates
    result = []
    for topic, data in topic_performance.items():
        if data['solvedProblems'] > 0:
            data['avgTime'] = round(data['totalTime'] / data['solvedProblems'], 1)
        
        data['completionRate'] = round(data['solvedProblems'] / data['totalProblems'] * 100 if data['totalProblems'] > 0 else 0, 1)
        result.append(data)
    
    # Sort by completion rate (descending)
    result.sort(key=lambda x: x['completionRate'], reverse=True)
    
    return result
