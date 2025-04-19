'use client';

import { useRouter } from 'next/navigation';

export default function CoreSubjects() {
  const router = useRouter();

  const subjects = [
    {
      name: 'Backend',
      description: 'Learn Backend',
      icon: '📊',
      path: '/dashboard/web-dev/backend'
    },
    {
      name: 'ReactJs',
      description: 'Learn React',
      icon: '💻',
      path: '/dashboard/web-dev/react'
    },
    {
      name: 'Next.Js',
      description: 'Learn NextJs',
      icon: '🏗️',
      path: '/dashboard/web-dev/nextjs'
    }
    
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Web Development
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
        Welcome to the Web Development section. Here you'll find resources, tutorials,
        and practice exercises to help you master web development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <button
            key={subject.name}
            onClick={() => router.push(subject.path)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 text-left"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-4">{subject.icon}</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {subject.name}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {subject.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
} 