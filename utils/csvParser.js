import { parse } from 'csv-parse/sync';

/**
 * Parse CSV data into an array of objects
 * @param {string} csvData - The CSV data as a string
 * @returns {Array} - Array of objects representing the CSV rows
 */
export async function parseCsv(csvData) {
  try {
    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Transform records to the correct format
    return records.map(record => {
      return {
        title: record.Title || '',
        difficulty: record.Difficulty || 'Medium',
        acceptance: record.Acceptance || '0%',
        frequency: record.Frequency || '1',
        link: record['Leetcode Question Link'] || `https://leetcode.com/problems/${record.Title.toLowerCase().replace(/\s+/g, '-')}`,
        topic: record.Topic || 'Other',
      };
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV data');
  }
}

/**
 * Parse topic progress CSV data
 * @param {string} csvData - The CSV data as a string
 * @returns {Array} - Array of objects representing topic progress
 */
export async function parseTopicProgressCsv(csvData) {
  try {
    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Transform records to the correct format
    return records.map(record => {
      return {
        topic: record.Topic || '',
        total: parseInt(record.Total) || 0,
        easy: parseInt(record.Easy) || 0,
        medium: parseInt(record.Medium) || 0,
        hard: parseInt(record.Hard) || 0,
        completion: parseFloat(record.Completion) || 0
      };
    });
  } catch (error) {
    console.error('Error parsing topic progress CSV:', error);
    throw new Error('Failed to parse topic progress CSV data');
  }
}
