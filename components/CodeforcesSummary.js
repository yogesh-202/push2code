import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CodeforcesSummary({ userData }) {
  if (!userData) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 w-full h-48"></div>;
  }

  const { user, stats } = userData;
  
  // Get rank color based on Codeforces rank
  const getRankColor = (rank) => {
    const rankColors = {
      'newbie': 'text-gray-500',
      'pupil': 'text-green-500',
      'specialist': 'text-cyan-500',
      'expert': 'text-blue-500',
      'candidate master': 'text-purple-500',
      'master': 'text-orange-500',
      'international master': 'text-orange-600',
      'grandmaster': 'text-red-500',
      'international grandmaster': 'text-red-600',
      'legendary grandmaster': 'text-red-700'
    };
    
    return rankColors[rank?.toLowerCase()] || 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Profile Section */}
        <div className="md:w-1/3 p-6 flex flex-col items-center justify-center border-b md:border-r md:border-b-0 border-gray-200 dark:border-gray-700">
          <div className="w-32 h-32 relative mb-4">
            {user.titlePhoto && !user.titlePhoto.includes('no-title.jpg') ? (
              <Image 
                src={user.titlePhoto}
                alt={user.handle}
                width={128}
                height={128}
                className="rounded-full"
                onError={() => {
                  // If image fails to load, it will render the fallback div below
                  console.log("Failed to load Codeforces profile image");
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-2xl font-bold">{user.handle?.[0]?.toUpperCase() || "CF"}</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold">{user.handle}</h3>
          <div className={`text-lg font-semibold ${getRankColor(user.rank)}`}>
            {user.rank || 'Unrated'}
          </div>
          <div className="mt-2 text-gray-600 dark:text-gray-300">
            Rating: <span className="font-semibold">{user.rating || 'N/A'}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Max Rating: <span className="font-semibold">{user.maxRating || 'N/A'}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="md:w-2/3 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Performance Summary</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">Problems Solved</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{stats.solvedCount}</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">Submissions</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{stats.submissionCount}</div>
            </div>
          </div>
          
          {/* Verdict Distribution */}
          <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">Verdict Distribution</h4>
          {stats.submissionsByVerdict && (
            <div className="space-y-2 mb-4">
              {Object.entries(stats.submissionsByVerdict).map(([verdict, count]) => (
                <div key={verdict} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-300 truncate">
                    {verdict === 'OK' ? 'Accepted' : verdict}
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${verdict === 'OK' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${(count / stats.submissionCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-sm text-gray-600 dark:text-gray-300 ml-2">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Most Solved Tags */}
          {stats.submissionsByTag && Object.keys(stats.submissionsByTag).length > 0 && (
            <>
              <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-200">Top Tags</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.submissionsByTag)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([tag, count]) => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {tag} ({count})
                    </span>
                  ))
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}