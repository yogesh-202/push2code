const { connectToDatabase } = require('../lib/mongodb');

const sampleProblems = [
  {
    contestId: 1,
    index: "A",
    name: "Theatre Square",
    type: "PROGRAMMING",
    rating: 1000,
    tags: ["math"],
    solvedCount: 100000,
    points: 1000
  },
  {
    contestId: 1,
    index: "B",
    name: "Spreadsheet",
    type: "PROGRAMMING",
    rating: 1200,
    tags: ["implementation", "math"],
    solvedCount: 80000,
    points: 1000
  },
  {
    contestId: 2,
    index: "A",
    name: "Winner",
    type: "PROGRAMMING",
    rating: 1500,
    tags: ["hashing", "implementation"],
    solvedCount: 60000,
    points: 1000
  },
  {
    contestId: 2,
    index: "B",
    name: "The least round way",
    type: "PROGRAMMING",
    rating: 1600,
    tags: ["dp", "math"],
    solvedCount: 40000,
    points: 1000
  },
  {
    contestId: 3,
    index: "A",
    name: "Shortest path of the king",
    type: "PROGRAMMING",
    rating: 800,
    tags: ["greedy", "implementation"],
    solvedCount: 90000,
    points: 1000
  },
  {
    contestId: 3,
    index: "B",
    name: "Lorry",
    type: "PROGRAMMING",
    rating: 1400,
    tags: ["greedy", "sortings"],
    solvedCount: 50000,
    points: 1000
  },
  {
    contestId: 4,
    index: "A",
    name: "Watermelon",
    type: "PROGRAMMING",
    rating: 800,
    tags: ["brute force", "math"],
    solvedCount: 120000,
    points: 1000
  },
  {
    contestId: 4,
    index: "B",
    name: "Before an Exam",
    type: "PROGRAMMING",
    rating: 1300,
    tags: ["greedy", "implementation"],
    solvedCount: 70000,
    points: 1000
  },
  {
    contestId: 5,
    index: "A",
    name: "Chat Server's Outgoing Traffic",
    type: "PROGRAMMING",
    rating: 900,
    tags: ["implementation", "strings"],
    solvedCount: 85000,
    points: 1000
  },
  {
    contestId: 5,
    index: "B",
    name: "Center Alignment",
    type: "PROGRAMMING",
    rating: 1100,
    tags: ["implementation", "strings"],
    solvedCount: 75000,
    points: 1000
  },
  {
    contestId: 6,
    index: "A",
    name: "Triangle",
    type: "PROGRAMMING",
    rating: 1000,
    tags: ["brute force", "geometry", "math"],
    solvedCount: 95000,
    points: 1000
  },
  {
    contestId: 6,
    index: "B",
    name: "President's Office",
    type: "PROGRAMMING",
    rating: 1200,
    tags: ["dfs and similar", "implementation"],
    solvedCount: 65000,
    points: 1000
  },
  {
    contestId: 7,
    index: "A",
    name: "Maximum in Table",
    type: "PROGRAMMING",
    rating: 800,
    tags: ["brute force", "implementation"],
    solvedCount: 110000,
    points: 1000
  },
  {
    contestId: 7,
    index: "B",
    name: "Memory Manager",
    type: "PROGRAMMING",
    rating: 1500,
    tags: ["implementation", "simulation"],
    solvedCount: 45000,
    points: 1000
  },
  {
    contestId: 8,
    index: "A",
    name: "Train and Peter",
    type: "PROGRAMMING",
    rating: 1100,
    tags: ["implementation", "strings"],
    solvedCount: 80000,
    points: 1000
  },
  {
    contestId: 8,
    index: "B",
    name: "Data Recovery",
    type: "PROGRAMMING",
    rating: 1400,
    tags: ["greedy", "implementation"],
    solvedCount: 55000,
    points: 1000
  },
  {
    contestId: 9,
    index: "A",
    name: "Die Roll",
    type: "PROGRAMMING",
    rating: 800,
    tags: ["math", "probabilities"],
    solvedCount: 100000,
    points: 1000
  },
  {
    contestId: 9,
    index: "B",
    name: "Running Student",
    type: "PROGRAMMING",
    rating: 1300,
    tags: ["geometry", "implementation"],
    solvedCount: 60000,
    points: 1000
  },
  {
    contestId: 10,
    index: "A",
    name: "Power Consumption Calculation",
    type: "PROGRAMMING",
    rating: 900,
    tags: ["implementation"],
    solvedCount: 90000,
    points: 1000
  },
  {
    contestId: 10,
    index: "B",
    name: "Cinema Cashier",
    type: "PROGRAMMING",
    rating: 1500,
    tags: ["greedy", "implementation"],
    solvedCount: 40000,
    points: 1000
  }
];

async function insertSampleProblems() {
  try {
    const { db } = await connectToDatabase();
    
    // Add derived fields to each problem
    const problemsWithDerivedFields = sampleProblems.map(problem => ({
      ...problem,
      id: `${problem.contestId}${problem.index}`,
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
    }));

    // Insert problems into the database
    const result = await db.collection('codeforcesProblems').insertMany(problemsWithDerivedFields);
    
    console.log(`Successfully inserted ${result.insertedCount} problems`);
    
    // Create indexes
    await db.collection('codeforcesProblems').createIndex({ rating: 1 });
    await db.collection('codeforcesProblems').createIndex({ tags: 1 });
    await db.collection('codeforcesProblems').createIndex({ contestId: 1, index: 1 }, { unique: true });
    
    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error inserting sample problems:', error);
  }
}

insertSampleProblems(); 