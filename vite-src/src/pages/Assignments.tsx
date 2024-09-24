function Assignments() {
    const latestAssignment = 1;
    const assignments = Array.from({ length: latestAssignment + 1 }, (_, i) => i);
    const assignment_descriptors = [
      "This is a simple assignment used as a test.",
      "This is the assignment on data colection and analysis."
    ]
  
    return (
      <div className="mt-20 p-6 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">CS506 Assignments</h1>
        <div className="space-y-8">
          {assignments.map((num) => (
            <div key={num}>
              <h2 className="text-2xl font-semibold">Assignment {num}</h2>
              <p className="mt-2">assignment_descriptors[num]</p>
              <a
                href={`https://github.com/user04f8-cs506/nbclark-assignment-${num}`}
                className="text-blue-500 underline"
              >
                Github Link
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default Assignments;
  
