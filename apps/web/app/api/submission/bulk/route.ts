import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/authOptions";
import { db } from "../../../db";

export async function GET(req: NextRequest) {
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
  const problemId = searchParams.get("problemId");

  if (!problemId) {
    return NextResponse.json(
      {
        message: "Invalid problem id",
      },
      {
        status: 400,
      },
    );
  }

  const submissions = await db.submission.findMany({
    where:{
        problemId:problemId,
        userId:session.user.id,
    },
    take:10,
    include:{
        testCases:true,
    },
    orderBy:{
        createdAt:'desc'
    }
  })

  return NextResponse.json(
    {
      submissions,
    },
    {
      status: 200,
    },
  );
}