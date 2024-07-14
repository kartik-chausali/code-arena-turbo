import { prismaClient } from "@repo/db/client";
import { db } from ".";

export const getProblem = async(problemId:string, contestId?: string)=>{

    if(contestId){
        //logic if contest
    }
    
    console.log("problem id in db", problemId)
    const problem = await db.problem.findFirst({
        where:{
            id:problemId
        },
        include:{
            DefaultCode:true,
            EditorialCode:true
        }
    })
    return problem

}

export const getProblems = async()=>{
    const problems = await db.problem.findMany({
        where:{
            hidden:true
        },
        include:{
            DefaultCode:true,
            EditorialCode:true,
        }
    })
    return problems
}