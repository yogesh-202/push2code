'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    cfid: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('REGISTER'); // REGISTER or VERIFY
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');

    if (emailParam || nameParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam || prev.email,
        fullName: nameParam || prev.fullName
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 'REGISTER') {
      const { username, fullName, email, password, cfid } = formData;

      if (!username || !fullName || !email || !password || !cfid) {
        setError('All fields are required');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        console.log('Signup Response:', {
          status: res.status,
          statusText: res.statusText,
          data: data
        });

        if (!res.ok) {
          throw new Error(data.error || data.message || 'Error during signup');
        }

        setStep('VERIFY');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    } else if (step === 'VERIFY') {
      try {
        setLoading(true);
        setError('');

        const verifyRes = await fetch('/api/auth/otp-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp
          }),
        });

        if (!verifyRes.ok) {
          throw new Error('Invalid OTP');
        }

        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result.error) {
          setError('Error signing in after verification');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* You can add your image section here */}
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'REGISTER' ? 'Create Your Account' : 'Verify Your Email'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'REGISTER' ? 'Join our community of problem solvers' : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'REGISTER' ? (
              <>
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
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="input-field"
                    placeholder="John Doe"
                    value={formData.fullName}
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
                  <label htmlFor="cfid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Codeforces ID
                  </label>
                  <input
                    id="cfid"
                    name="cfid"
                    type="text"
                    required
                    className="input-field"
                    placeholder="coder123"
                    value={formData.cfid}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={loading}
              >
                {loading
                  ? (step === 'REGISTER' ? 'Creating Account...' : 'Verifying...')
                  : (step === 'REGISTER' ? 'Sign Up' : 'Verify OTP')}
              </button>
            </div>
          </form>

          {step === 'REGISTER' && (
            <>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Image
                    src="/google-icon-logo-svgrepo-com.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Sign up with Google
                </button>
              </div>
            </>
          )}

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

