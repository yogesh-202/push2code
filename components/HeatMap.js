import { useEffect, useState } from 'react';

export default function HeatMap({ data }) {
  const [calendarData, setCalendarData] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  
  useEffect(() => {
    if (!data || data.length === 0) {
      setCalendarData([]);
      setMonthLabels([]);
      return;
    }
    
    // Process data for the heatmap
    processData();
  }, [data]);
  
  const processData = () => {
    // Define month names
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Get dates range
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 119); // 120 days including today
    
    // Initialize data map for quick lookup
    const dataMap = {};
    data.forEach(item => {
      dataMap[item.date] = item.count;
    });
    
    // Create calendar cells
    const cells = [];
    let currentDate = new Date(startDate);
    
    // Calculate the number of weeks (rows)
    const numWeeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000)) + 1;
    
    // Create row for each day of week
    for (let dow = 0; dow < 7; dow++) {
      const row = [];
      
      // Reset to start date and move to the first occurrence of this day of week
      currentDate = new Date(startDate);
      const dayDiff = dow - currentDate.getDay();
      currentDate.setDate(currentDate.getDate() + (dayDiff >= 0 ? dayDiff : dayDiff + 7));
      
      // Fill in cells for this day of week across all weeks
      for (let week = 0; week < numWeeks; week++) {
        // Skip if this date is before our start date or after today
        if (currentDate < startDate || currentDate > today) {
          currentDate.setDate(currentDate.getDate() + 7);
          row.push(null);
          continue;
        }
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = dataMap[dateStr] || 0;
        
        row.push({
          date: dateStr,
          count,
          intensity: getIntensity(count)
        });
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }
      
      cells.push(row);
    }
    
    // Generate month labels
    const labels = [];
    currentDate = new Date(startDate);
    let currentMonth = currentDate.getMonth();
    
    for (let week = 0; week < numWeeks; week++) {
      const month = currentDate.getMonth();
      
      if (month !== currentMonth) {
        labels.push({
          week,
          label: months[month]
        });
        currentMonth = month;
      }
      
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    setCalendarData(cells);
    setMonthLabels(labels);
  };
  
  const getIntensity = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4; // 4+ contributions
  };
  
  const getCellColor = (intensity) => {
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity === 1) return 'bg-green-200 dark:bg-green-900';
    if (intensity === 2) return 'bg-green-300 dark:bg-green-800';
    if (intensity === 3) return 'bg-green-400 dark:bg-green-700';
    return 'bg-green-500 dark:bg-green-600';
  };
  
  // Day of week labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="relative">
          {/* Month labels */}
          <div className="flex mb-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-8"></div>
            <div className="flex-1 relative">
              {monthLabels.map((label, i) => (
                <div 
                  key={i} 
                  className="absolute"
                  style={{ left: `${(label.week / (calendarData[0]?.length || 1)) * 100}%` }}
                >
                  {label.label}
                </div>
              ))}
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="flex">
            {/* Day of week labels */}
            <div className="flex flex-col mr-2">
              {dayLabels.map((day, i) => (
                <div 
                  key={i} 
                  className="h-3 w-8 flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                  {i % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>
            
            {/* Calendar cells */}
            <div className="flex-1">
              {calendarData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex mb-1">
                  {row.map((cell, cellIndex) => (
                    <div 
                      key={cellIndex}
                      className={`h-3 w-3 rounded-sm mr-1 ${
                        cell ? getCellColor(cell.intensity) : 'bg-transparent'
                      }`}
                      title={cell ? `${cell.date}: ${cell.count} contributions` : ''}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-end mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Less</span>
            <div className={`h-3 w-3 rounded-sm mr-1 ${getCellColor(0)}`}></div>
            <div className={`h-3 w-3 rounded-sm mr-1 ${getCellColor(1)}`}></div>
            <div className={`h-3 w-3 rounded-sm mr-1 ${getCellColor(2)}`}></div>
            <div className={`h-3 w-3 rounded-sm mr-1 ${getCellColor(3)}`}></div>
            <div className={`h-3 w-3 rounded-sm mr-1 ${getCellColor(4)}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}