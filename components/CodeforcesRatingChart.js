import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function CodeforcesRatingChart({ ratingHistory }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!ratingHistory || ratingHistory.length === 0) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Prepare data for chart
    const labels = ratingHistory.map((contest, index) => `Contest ${index + 1}`);
    const ratings = ratingHistory.map(contest => contest.newRating);
    
    // Get min and max for better y-axis scaling
    const minRating = Math.min(...ratings) - 100;
    const maxRating = Math.max(...ratings) + 100;
    
    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Rating',
          data: ratings,
          borderColor: '#6366F1', // Indigo color
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          tension: 0.2,
          fill: true,
          pointBackgroundColor: ratingHistory.map(contest => {
            const change = contest.newRating - contest.oldRating;
            return change > 0 ? '#10B981' : '#EF4444'; // Green if positive, red if negative
          }),
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const contestIndex = context.dataIndex;
                const contest = ratingHistory[contestIndex];
                const change = contest.newRating - contest.oldRating;
                const changeText = change >= 0 ? `+${change}` : `${change}`;
                return [
                  `Contest: ${contest.contestName}`,
                  `Rank: ${contest.rank}`,
                  `Change: ${changeText}`
                ];
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            min: minRating,
            max: maxRating,
            grid: {
              color: 'rgba(160, 174, 192, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
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
  }, [ratingHistory]);
  
  if (!ratingHistory || ratingHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <p className="text-center text-gray-500 dark:text-gray-400">No rating history available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Rating History</h3>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}