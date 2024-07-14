/* eslint-disable no-unused-vars */
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/authOptions";
import {submissionInput} from '@repo/common/zod'
import { getProblem } from '../../../lib/problem';
import { db } from "../../db";
import axios from "axios";
import { JUDGE0_URI } from "../../../lib/config";
import { LANGUAGE_MAPPING } from "@repo/common/language";
export async function POST(req:NextRequest){
    const session = await getServerSession(authOptions);
    if(!session?.user){
        return NextResponse.json(
            {
              message: "You must be logged in to submit a problem",
            },
            {
              status: 401,
            },
          );
    }

    const userId = session.user.id;
    console.log("logging user ", session.user);
      //Todo : using the ratelimt function from lib, 1 req per 10 seconds
      const submission = submissionInput.safeParse(await req.json());

      if (!submission.success) {
        return NextResponse.json(
          {
            message: "Invalid input",
          },
          {
            status: 400,
          },
        );
      }

      const dbProblem = await db.problem.findUnique({
        where:{
            id: submission.data.problemId
        }
      })


  if (!dbProblem) {
    return NextResponse.json(
      {
        message: "Problem not found",
      },
      {
        status: 404,
      },
    );
  }

    const headers = {
        'content-type': 'application/json',
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': '9a31a4be95mshd61649b24f6096dp19bc93jsnff5ae08df71d',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    }
    const problem = await getProblem( dbProblem.slug, submission.data.languageId);
   

    problem.fullBoilerplateCode = problem.fullBoilerplateCode.replace("##USER_CODE_HERE##", submission.data.code,);

    const response = await axios.post( `${JUDGE0_URI}/batch?base64_encoded=false`,
    {
      submissions: problem.inputs.map((input, index) => ({
        language_id: LANGUAGE_MAPPING[submission.data.languageId]?.judge0,
        source_code: problem.fullBoilerplateCode,
        stdin: input,
        expected_output: problem.outputs[index],
        callback_url:"https://3847-2401-4900-468c-ad67-8596-76a-bf2b-e57c.ngrok-free.app/submission-callback",
      })),
    },{
        headers:headers 
    })
    console.log(response.status);
   console.log("looging output", response.data.stdout, response);
    const onSubmission = await db.submission.create({
       data:{
        userId: session.user.id,
        problemId: submission.data.problemId,
        languageId: LANGUAGE_MAPPING[submission.data.languageId]?.internal!,
        code: submission.data.code,
        fullCode: problem.fullBoilerplateCode,
        status: "PENDING",
       }
    })

    await db.testCase.createMany({
        data:problem.inputs.map((input, index)=>({
            SubmissionId: onSubmission.id,
            status:'PENDING',
            index,
            judge0TrackingId:response.data[index].token,
        }))
    })

    return NextResponse.json(
        {
          message: "Submission made",
          id: onSubmission.id,
        },
        {
          status: 200,
        },
      );
}

export async function GET(req: NextRequest){
    const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        message: "You must be logged in to view submissions",
      },
      {
        status: 401,
      },
    );
  }

  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const submissionId = searchParams.get("id");

  if (!submissionId) {
    return NextResponse.json(
      {
        message: "Invalid submission id",
      },
      {
        status: 400,
      },
    );
  }

  const submission = await db.submission.findUnique({
    where:{
        id: submissionId,
        userId: session.user.id
    }
  })

  if (!submission) {
    return NextResponse.json(
      {
        message: "Submission not found",
      },
      {
        status: 404,
      },
    );
  }

  const testCases = await db.testCase.findMany({
    where: {
      SubmissionId: submissionId
    },
  });

  return NextResponse.json(
    {
      submission,
      testCases,
    },
    {
      status: 200,
    },
  );
}