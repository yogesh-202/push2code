'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function RadarChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!data || data.length === 0) {
      return;
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Prepare data for chart
    const labels = data.map(item => item.topic);
    const completionRates = data.map(item => item.completionRate);
    
    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Topic Completion (%)',
          data: completionRates,
          fill: true,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: '#6366F1',
          pointBackgroundColor: '#6366F1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366F1'
        }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true,
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563',
              font: {
                size: 10
              }
            },
            ticks: {
              backdropColor: 'transparent',
              color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563'
            },
            min: 0,
            max: 100,
            stepSize: 20
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        maintainAspectRatio: false
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  // Listen for theme changes to update the chart colors
  useEffect(() => {
    const updateChartColors = () => {
      if (chartInstance.current) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        chartInstance.current.options.scales.r.angleLines.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chartInstance.current.options.scales.r.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chartInstance.current.options.scales.r.pointLabels.color = isDarkMode ? '#D1D5DB' : '#4B5563';
        chartInstance.current.options.scales.r.ticks.color = isDarkMode ? '#D1D5DB' : '#4B5563';
        
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

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
