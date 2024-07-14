
import { getProblems } from "../db/problems"
import { SolveProblemButton } from "./SolveProblemButton";

export default async function Problems(){

    const problems = await getProblems();
    console.log("logging all the problems", problems);
   
    return (
        <section className="bg-white dark:bg-gray-900 py-8 md:py-12 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Popular Problems</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check out the most popular programming problems on Code-Arena.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <ProblemCard problem={problem} key={problem.id} />
          ))}
        </div>
      </div>
    </section>
    )
}

function ProblemCard({problem}:{problem:any}){
    return (
        <div className="flex flex-col  bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {problem.tittle}
        </h1>
        <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">
        Easy problem for beginners
        </p>
        <div className="flex flex-row mt-3 justify-between">
            <div className="flex flex-col">
            
            <div className="text-bold text-gray-400 text-lg">
                Difficulty
            </div>
            {problem.difficulty === 'EASY' && <div className="text-green-500">
                {problem.difficulty}
                </div>}
            {problem.difficulty === 'MEDIUM' && <div className="text-yellow-500"> 
                {problem.difficulty}
            </div>} 
            {problem.difficulty === 'HARD' && <div className="text-red-500"> 
                {problem.difficulty}
            </div>} 

            </div>

            <div className=" items-end justify-end">
                <div className="text-bold text-gray-400 text-lg">
                    Submissions
                </div>
                <div>
                    {problem.solved}
                </div>
            </div>
          
        </div>
        <SolveProblemButton href={`/problem/${problem.id}`}>
            Solve Problem
        </SolveProblemButton>
      </div>
    )
}