'use client';

export default function TopicFilter({ topics, selectedTopic, onChange }) {
  if (!topics || topics.length === 0) {
    // Default topics if none provided
    topics = ['Array', 'String', 'Linked List', 'Tree', 'Dynamic Programming', 'Graph', 'Backtracking'];
  }

  return (
    <div>
      <label htmlFor="topic-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Topic
      </label>
      <select
        id="topic-filter"
        className="input-field"
        value={selectedTopic}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Topics</option>
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
}
