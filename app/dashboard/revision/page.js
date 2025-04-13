
'use client';

import { useState, useEffect } from 'react';
import ProblemCard from '@/components/ProblemCard';

export default function RevisionPage() {
  const [revisionProblems, setRevisionProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevisionProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/problems/revision', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch revision problems: ${response.statusText}`);
        }

        const data = await response.json();
        setRevisionProblems(data.revisionProblems || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching revision problems:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevisionProblems();
  }, []);

  // Group problems by topic
  const problemsByTopic = revisionProblems.reduce((acc, problem) => {
    const topic = problem.topic || 'Other';
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(problem);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Problems for Revision
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Problems that need revision based on your solve history and difficulty ratings
        </p>
      </div>

      {Object.keys(problemsByTopic).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No problems marked for revision yet. Mark problems for revision from the Problems page.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(problemsByTopic).map(([topic, problems]) => (
            <div key={topic} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{topic}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems.map((problem) => (
                  <ProblemCard 
                    key={problem.id} 
                    problem={problem}
                    onClick={() => window.open(problem.link, '_blank')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
