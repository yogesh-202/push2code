  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Problems</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{problems.length}</p>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Solved</h3>
      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{solvedCount}</p>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">For Revision</h3>
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{revisionCount}</p>
    </div>
  </div> 