import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function CodeforcesRatingChart({ ratingHistory }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!ratingHistory || ratingHistory.length === 0 || !chartRef.current) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Prepare data for the chart
    const dates = ratingHistory.map(entry => new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString());
    const ratings = ratingHistory.map(entry => entry.newRating);
    const oldRatings = ratingHistory.map(entry => entry.oldRating);
    const contestNames = ratingHistory.map(entry => entry.contestName);
    const ranks = ratingHistory.map(entry => entry.rank);
    
    // Find minimum and maximum ratings for the y-axis scale
    const allRatings = [...ratings, ...oldRatings.filter(r => r > 0)];
    const minRating = Math.min(...allRatings);
    const maxRating = Math.max(...allRatings);
    
    // Add padding to the y-axis
    const yMin = Math.max(0, minRating - 200);
    const yMax = maxRating + 200;
    
    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    
    // Function to determine color bands based on rating ranges
    const getRatingColorBands = () => {
      const colorBands = [];
      
      // Define color bands based on Codeforces rating ranges
      const bands = [
        { min: 0, max: 1200, color: 'rgba(128, 128, 128, 0.2)' },     // Gray (Newbie)
        { min: 1200, max: 1400, color: 'rgba(0, 128, 0, 0.2)' },      // Green (Pupil)
        { min: 1400, max: 1600, color: 'rgba(0, 192, 192, 0.2)' },    // Cyan (Specialist)
        { min: 1600, max: 1900, color: 'rgba(0, 0, 255, 0.2)' },      // Blue (Expert)
        { min: 1900, max: 2100, color: 'rgba(170, 0, 170, 0.2)' },    // Purple (Candidate Master)
        { min: 2100, max: 2400, color: 'rgba(255, 204, 0, 0.2)' },    // Yellow (Master)
        { min: 2400, max: 3000, color: 'rgba(255, 0, 0, 0.2)' }       // Red (Grandmaster+)
      ];
      
      // Create color bands that fit within our y-axis range
      bands.forEach(band => {
        if (band.min <= yMax && band.max >= yMin) {
          const adjustedMin = Math.max(band.min, yMin);
          const adjustedMax = Math.min(band.max, yMax);
          
          if (adjustedMax > adjustedMin) {
            colorBands.push({
              min: adjustedMin,
              max: adjustedMax,
              color: band.color
            });
          }
        }
      });
      
      return colorBands;
    };
    
    // Get rating color for the line based on current rating
    const getLineColor = (rating) => {
      if (rating < 1200) return 'rgb(128, 128, 128)';       // Gray (Newbie)
      if (rating < 1400) return 'rgb(0, 128, 0)';           // Green (Pupil)
      if (rating < 1600) return 'rgb(0, 192, 192)';         // Cyan (Specialist)
      if (rating < 1900) return 'rgb(0, 0, 255)';           // Blue (Expert)
      if (rating < 2100) return 'rgb(170, 0, 170)';         // Purple (Candidate Master)
      if (rating < 2400) return 'rgb(255, 204, 0)';         // Yellow (Master)
      return 'rgb(255, 0, 0)';                             // Red (Grandmaster+)
    };
    
    const currentRating = ratings[ratings.length - 1];
    const lineColor = getLineColor(currentRating);
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Rating',
          data: ratings,
          borderColor: lineColor,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: ratings.map((rating, i) => {
            // Red for rating decrease, green for rating increase or no change
            return rating < oldRatings[i] ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)';
          }),
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return contestNames[index];
              },
              afterTitle: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return `Rank: ${ranks[index]}`;
              },
              label: (context) => {
                const index = context.dataIndex;
                const change = ratings[index] - oldRatings[index];
                const sign = change > 0 ? '+' : '';
                return `Rating: ${ratings[index]} (${sign}${change})`;
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(200, 200, 200, 0.1)'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            min: yMin,
            max: yMax,
            grid: {
              color: 'rgba(200, 200, 200, 0.1)'
            },
            ticks: {
              callback: function(value) {
                return value;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      },
      plugins: [{
        id: 'backgroundColorPlugin',
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          const yAxis = chart.scales.y;
          
          // Draw color bands
          const colorBands = getRatingColorBands();
          colorBands.forEach(band => {
            const yTop = yAxis.getPixelForValue(band.max);
            const yBottom = yAxis.getPixelForValue(band.min);
            const height = yBottom - yTop;
            
            ctx.fillStyle = band.color;
            ctx.fillRect(
              chartArea.left,
              yTop,
              chartArea.right - chartArea.left,
              height
            );
          });
        }
      }]
    });
    
    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [ratingHistory]);
  
  return (
    <div className="w-full h-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}