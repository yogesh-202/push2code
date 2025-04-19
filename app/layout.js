'use client';

import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import Navbar from '../components/Navbar';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {mounted && <Navbar />}
              <main className="flex-grow">
                {mounted ? children : null}
              </main>
              <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Push2Code. All rights reserved.
              </footer>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
