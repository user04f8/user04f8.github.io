import './Assignments.css'

function Assignments() {
  const latest_assign = 0;

  return (
    <div className="assignments">
      <h1>CS506 Assignments</h1>
      <div className="assignment">
        
        {
        Array.from({ length: latest_assign + 1 }, (_, i) => (
            <>
                <h2>Assignment {i}</h2>
                <a key={i} href={`https://github.com/user04f8-cs506/nbclark-assignment-${i}`}>
                    Github Link
                </a>
            </>
        ))
        }
      </div>
    </div>
  );
}

export default Assignments;
