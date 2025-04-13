
'use client';

import { useState, useEffect } from 'react';
import ProblemCard from '@/components/ProblemCard';

export default function RevisionPage() {
  const [revisionProblems, setRevisionProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevisionProblems = async () => {
      try {
        const response = await fetch('/api/problems/revision');
        const data = await response.json();
        setRevisionProblems(data.revisionProblems);
      } catch (error) {
        console.error('Error fetching revision problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevisionProblems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {revisionProblems.map((problem) => (
          <ProblemCard 
            key={problem.id} 
            problem={problem}
            onClick={() => window.open(problem.link, '_blank')}
          />
        ))}
      </div>
    </div>
  );
}
