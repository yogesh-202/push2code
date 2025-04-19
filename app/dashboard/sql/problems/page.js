'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SqlProblemCard from '@/components/SqlProblemCard';

export default function SqlProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [revisionCount, setRevisionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/problems/sql', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch SQL problems');
        }

        const data = await response.json();
        setProblems(data.problems || []);
        
        // Calculate counts
        const solved = data.problems.filter(p => p.solved).length;
        const forRevision = data.problems.filter(p => p.markedForRevision).length;
        
        setSolvedCount(solved);
        setRevisionCount(forRevision);
      } catch (err) {
        console.error('Error fetching SQL problems:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [router]);

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
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">SQL Problems</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Problems</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{problems.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Solved</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{solvedCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">For Revision</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{revisionCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <SqlProblemCard 
            key={problem._id || problem.id} 
            problem={problem} 
            onClick={() => window.open(problem.url || problem.link, '_blank')}
          />
        ))}
      </div>
    </div>
  );
} 