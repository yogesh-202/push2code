'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  // Check if user is logged in and redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Level Up Your Coding Journey
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Track your progress, identify your weaknesses, and improve your problem-solving skills with our personalized coding practice platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <button className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-md font-semibold text-lg w-full sm:w-auto">
                  Get Started
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-md font-semibold text-lg w-full sm:w-auto">
                  Log In
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-80 md:h-96" style={{ position: 'relative' }}>
              <Image
                src="https://images.unsplash.com/photo-1607706189992-eae578626c86"
                alt="Coding Dashboard"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Features to Accelerate Your Learning
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Topic-Based Organization</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice problems organized by topics and difficulty levels to structure your learning journey.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your solved problems, time spent, and difficulty ratings to measure your improvement.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Critical Topics Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get insights into your weak areas with visualizations highlighting topics you need to focus on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Your Personal Coding Dashboard
          </h2>
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-xl" style={{ position: 'relative' }}>
            <Image
              src="https://images.unsplash.com/photo-1499673610122-01c7122c5dcb"
              alt="DSA Dashboard Interface"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Visualization Preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Visualize Your Progress
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-72 md:h-80 rounded-lg overflow-hidden shadow-lg" style={{ position: 'relative' }}>
              <Image
                src="https://images.unsplash.com/photo-1653389525308-e7ab9fc0c260"
                alt="Algorithm Visualization"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-72 md:h-80 rounded-lg overflow-hidden shadow-lg" style={{ position: 'relative' }}>
              <Image
                src="https://images.unsplash.com/photo-1653389526309-f8e2e75f8aaf"
                alt="Progress Tracking"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Coding Skills?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join Push2Code today and take your coding practice to the next level.
          </p>
          <Link href="/signup">
            <button className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-md font-semibold text-lg">
              Start Your Journey Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
