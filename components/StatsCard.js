import React from 'react';

export default function StatsCard({ title, value, total, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
          {total && (
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
              /{total}
            </span>
          )}
        </p>
      </div>
    </div>
  );
} 