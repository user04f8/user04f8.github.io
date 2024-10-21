import KMeansApp from "../external/assignment-2/src/KMeansApp";
import LSAApp from "../external/assignment-4/App"

function Assignments() {
    const latestAssignment = 5;
    const assignments = Array.from({ length: latestAssignment + 1 }, (_, i) => i);
    const assignment_descriptors = [
      <>
      This is a simple assignment used as a test.
      </>,
      <>
      This is the assignment on data colection and analysis.
      </>,
      <KMeansApp/>,
      <>
      This is the completed analysis of SVD on MNIST
      </>,
      <LSAApp />,
      <>
      This is the submission to this <a href="https://www.kaggle.com/competitions/cs-506-predicting-customer-churn-using-knn/leaderboard">Kaggle competition</a>
      </>
    ]
  
    return (
      <div className="mt-20 p-6 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">Weekly mini-projects</h1>
        <div className="space-y-8">
          {assignments.map((num) => (
            <div key={num}>
              <h2 className="text-2xl font-semibold">Assignment {num}</h2>
              <p className="mt-2">{assignment_descriptors[num]}</p>
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
  
