'use client';

export default function ProgressBar({ percentage, color }) {
  if (isNaN(percentage) || percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  // Select color class based on the color prop
  let colorClass = 'bg-indigo-600 dark:bg-indigo-500';
  
  if (color === 'red') {
    colorClass = 'bg-red-600 dark:bg-red-500';
  } else if (color === 'green') {
    colorClass = 'bg-green-600 dark:bg-green-500';
  } else if (color === 'yellow') {
    colorClass = 'bg-yellow-600 dark:bg-yellow-500';
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div 
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`} 
        style={{ width: `${percentage}%` }}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  );
}
