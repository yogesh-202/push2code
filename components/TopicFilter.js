'use client';

export default function TopicFilter({ topics, selectedTopic, onChange }) {
  // Ensure topics array is always valid, even if empty from parent.
  // The parent component (problems/page.js) is responsible for fetching and providing dynamic topics (tags).
  const displayTopics = topics || []; 

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
        {displayTopics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
}
