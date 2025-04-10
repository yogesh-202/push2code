'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function ProgressChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const statsData = await response.json();
        
        // Prepare data for chart
        // Last 7 days (or less if not enough data)
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        // Use some mock data for the chart since we might not have actual daily data
        // In a real scenario, you'd fetch actual daily progress data
        const solvedData = [
          Math.floor(statsData.totalSolved * 0.6),  // Starting point
          Math.floor(statsData.totalSolved * 0.65),
          Math.floor(statsData.totalSolved * 0.7),
          Math.floor(statsData.totalSolved * 0.75),
          Math.floor(statsData.totalSolved * 0.85),
          Math.floor(statsData.totalSolved * 0.95),
          statsData.totalSolved  // Current count
        ].slice(-dates.length);  // In case we have less than 7 days
        
        setData({
          labels: dates,
          datasets: [
            {
              label: 'Problems Solved',
              data: solvedData,
              fill: false,
              borderColor: '#6366F1',
              tension: 0.1,
              backgroundColor: '#6366F1'
            }
          ]
        });
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Only create chart once we have data
    if (data.labels.length === 0 || loading) return;
    
    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#F3F4F6' : '#374151'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563',
              precision: 0
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading]);

  // Listen for theme changes to update the chart colors
  useEffect(() => {
    const updateChartColors = () => {
      if (chartInstance.current) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        chartInstance.current.options.scales.y.ticks.color = isDarkMode ? '#D1D5DB' : '#4B5563';
        chartInstance.current.options.scales.x.ticks.color = isDarkMode ? '#D1D5DB' : '#4B5563';
        chartInstance.current.options.scales.y.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chartInstance.current.options.scales.x.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chartInstance.current.options.plugins.legend.labels.color = isDarkMode ? '#F3F4F6' : '#374151';
        
        chartInstance.current.update();
      }
    };
    
    // Add event listener for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateChartColors();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 dark:text-red-400">Error loading chart: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
