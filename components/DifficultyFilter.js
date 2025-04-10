'use client';

export default function DifficultyFilter({ selectedDifficulty, onChange }) {
  return (
    <div>
      <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Difficulty
      </label>
      <select
        id="difficulty-filter"
        className="input-field"
        value={selectedDifficulty}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
}
