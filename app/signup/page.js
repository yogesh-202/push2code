'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


/*
When you call setFormData((prev) => {...}), React automatically provides the current state (formData) as prev.
Example:
Initial State: formData = { username: '', email: '' }
User Input: Changes username to 'John'
Function Call: setFormData((prev) => ({ ...prev, [name]: value }))
prev Value: { username: '', email: '' }
Updated State: { username: 'John', email: '' }
React handles prev internally, ensuring you work with the latest state*/

//

  const handleChange = (e) => {    
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();  //it prevents the browser from reloading the page, allowing you to handle the form 
    // submission with JavaScript instead. This is essential for single-page applications where you want
    //  to manage form submissions asynchronously without a full page refresh.
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Send a POST request to the signup API endpoint
      const response = await fetch('/api/auth/signup', {
        // Specify the HTTP method as POST for creating a new resource
        method: 'POST',
        // Set the request headers to indicate the content type as JSON
        headers: {
          'Content-Type': 'application/json',
        },
        // Convert the formData object to a JSON string to send in the request body
        body: JSON.stringify({
          // Include the username from formData in the request payload
          username: formData.username,
          // Include the email from formData in the request payload
          email: formData.email,
          // Include the password from formData in the request payload
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during signup');
      }
      
      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
          alt="Coding Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/70 to-purple-700/70 flex items-center justify-center">
          <div className="text-white text-center max-w-md mx-auto p-8">
            <h2 className="text-3xl font-bold mb-4">Start Your DSA Journey Today</h2>
            <p className="text-lg">
              Track your progress, analyze your performance, and improve your problem-solving skills with our personalized platform.
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join our community of problem solvers
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/50 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field"
                placeholder="john_doe"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary py-3"
                // The 'disabled' attribute is set to the value of 'loading'.
                // When 'loading' is true, the button is disabled, preventing user interaction.
                // This is typically used to prevent multiple submissions while a request is being processed.
                disabled={loading} 
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
