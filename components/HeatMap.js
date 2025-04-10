'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function HeatMap({ data }) {
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
    const sortedData = [...data].sort((a, b) => b.criticalScore - a.criticalScore);
    const labels = sortedData.map(item => item.name);
    const criticalScores = sortedData.map(item => item.criticalScore);
    
    // Create color scale based on critical score
    const generateColor = (score) => {
      // Score ranges from 0 (less critical) to potentially 200+ (very critical)
      // Red intensity increases with score
      const redIntensity = Math.min(255, Math.round(150 + score / 2));
      const greenIntensity = Math.max(0, Math.round(255 - score));
      return `rgba(${redIntensity}, ${greenIntensity}, 0, 0.7)`;
    };
    
    const backgroundColors = criticalScores.map(score => generateColor(score));
    
    // Create new chart as a horizontal bar chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Critical Score',
          data: criticalScores,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563'
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const index = context.dataIndex;
                const item = sortedData[index];
                return [
                  `Solved: ${item.solved}/${item.total} (${item.completionRate}%)`,
                  `Avg Time: ${item.averageTime} mins`,
                  `Reason: ${item.reason}`
                ];
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
        
        chartInstance.current.options.scales.x.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chartInstance.current.options.scales.x.ticks.color = isDarkMode ? '#D1D5DB' : '#4B5563';
        chartInstance.current.options.scales.y.ticks.color = isDarkMode ? '#D1D5DB' : '#4B5563';
        
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
        <p className="text-gray-500 dark:text-gray-400">No critical topics identified yet</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
