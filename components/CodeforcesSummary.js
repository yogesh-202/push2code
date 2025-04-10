import { useState } from 'react';
import CodeforcesRatingChart from './CodeforcesRatingChart';

export default function CodeforcesSummary({ userData }) {
  const [activeTab, setActiveTab] = useState('stats');
  
  if (!userData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-500 dark:text-gray-400">
          No Codeforces data available. Please enter your Codeforces handle to view your profile.
        </p>
      </div>
    );
  }

  const { user, ratingHistory, performance } = userData;
  
  // Determine user rank color and title
  const getRankClass = (rating) => {
    if (!rating) return 'text-gray-500';
    if (rating < 1200) return 'text-gray-500';
    if (rating < 1400) return 'text-green-500';
    if (rating < 1600) return 'text-cyan-500';
    if (rating < 1900) return 'text-blue-500';
    if (rating < 2100) return 'text-purple-500';
    if (rating < 2400) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const rankClass = getRankClass(user.rating);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center p-6 border-b dark:border-gray-700">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img 
            src={user.avatar || 'https://userpic.codeforces.org/no-avatar.jpg'} 
            alt={user.handle} 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
          />
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start">
            <span className={rankClass}>{user.handle}</span>
            {user.rank && (
              <span className="ml-2 text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {user.rank}
              </span>
            )}
          </h1>
          
          <div className="mt-2 text-gray-600 dark:text-gray-400">
            {user.firstName || user.lastName ? (
              <p>{`${user.firstName || ''} ${user.lastName || ''}`}</p>
            ) : null}
            
            {user.country && (
              <p>
                {user.country}
                {user.city && `, ${user.city}`}
              </p>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
            <div className="flex flex-col items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
              <span className={`font-bold ${rankClass}`}>
                {user.rating || 'Unrated'}
              </span>
            </div>
            
            <div className="flex flex-col items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="text-xs text-gray-500 dark:text-gray-400">Max Rating</span>
              <span className={`font-bold ${getRankClass(user.maxRating)}`}>
                {user.maxRating || 'Unrated'}
              </span>
            </div>
            
            <div className="flex flex-col items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="text-xs text-gray-500 dark:text-gray-400">Contribution</span>
              <span className={`font-bold ${user.contribution >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {user.contribution}
              </span>
            </div>
            
            {performance && (
              <div className="flex flex-col items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-xs text-gray-500 dark:text-gray-400">Solved</span>
                <span className="font-bold text-blue-500">
                  {performance.solvedCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b dark:border-gray-700">
        <nav className="flex">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'stats'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'rating'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('rating')}
          >
            Rating History
          </button>
          
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'topics'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Statistics
            </h2>
            
            {performance ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Distribution
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {performance.levelDistribution.map(level => (
                      <div key={level.level} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className={getRankClass(getLevelRating(level.level))}>
                            {level.level}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {level.count} problems
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getLevelColor(level.level)}`}
                            style={{ width: `${level.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No statistics available. This could be because you haven't solved any problems
                or we couldn't fetch your submission data.
              </p>
            )}
          </div>
        )}
        
        {activeTab === 'rating' && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Rating History
            </h2>
            
            {ratingHistory && ratingHistory.length > 0 ? (
              <div className="h-80">
                <CodeforcesRatingChart ratingHistory={ratingHistory} />
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No rating history available. This could be because you haven't participated
                in any rated contests yet.
              </p>
            )}
          </div>
        )}
        
        {activeTab === 'topics' && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Topic Analysis
            </h2>
            
            {performance && performance.strongTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-3">
                    Strong Topics
                  </h3>
                  <ul className="space-y-2">
                    {performance.strongTags.map(item => (
                      <li key={item.tag} className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        <span className="text-gray-800 dark:text-gray-200">{item.tag}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.count} problems ({item.percentage}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-red-600 dark:text-red-400 mb-3">
                    Topics to Improve
                  </h3>
                  <ul className="space-y-2">
                    {performance.weakTags.map(item => (
                      <li key={item.tag} className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <span className="text-gray-800 dark:text-gray-200">{item.tag}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.count} problems ({item.percentage}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No topic analysis available. This could be because you haven't solved enough
                problems for us to analyze your strengths and weaknesses.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get rating for a level (approximate middle value)
function getLevelRating(level) {
  const ratings = {
    'Newbie': 1000,
    'Pupil': 1300,
    'Specialist': 1500,
    'Expert': 1750,
    'Candidate Master': 2000,
    'Master': 2250,
    'International Master': 2500,
    'Grandmaster': 2750,
    'International Grandmaster': 3000
  };
  
  return ratings[level] || null;
}

// Helper function to get color for level bar
function getLevelColor(level) {
  switch (level) {
    case 'Newbie': return 'bg-gray-500';
    case 'Pupil': return 'bg-green-500';
    case 'Specialist': return 'bg-cyan-500';
    case 'Expert': return 'bg-blue-500';
    case 'Candidate Master': return 'bg-purple-500';
    case 'Master': return 'bg-yellow-500';
    case 'International Master': return 'bg-yellow-600';
    case 'Grandmaster': return 'bg-red-500';
    case 'International Grandmaster': return 'bg-red-600';
    default: return 'bg-gray-500';
  }
}