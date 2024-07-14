import express from 'express'
import prismaClient from './db'
import {submissionCallback} from '@repo/common/zod'
import { outputMapping } from './outputMapping';

const app = express();
import cors from 'cors'
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.put('/submission-callback', async(req, res)=>{
    const parsedBody = submissionCallback.safeParse(req.body);
    console.log("in submission webhook");
    console.log("req body", req.body)

    if (!parsedBody.success) {
        return res.status(403).json({
          message: "Invalid input",
        });
      }
      
      console.log("logging status", parsedBody.data.status.description);
      console.log("logging output", parsedBody.data.stdout);
      console.log("logging token", parsedBody.data.token);

      try{
        const testCase = await prismaClient.testCase.update({
          where:{
              judge0TrackingId:parsedBody.data.token,
          },
          data:{
              status: outputMapping[parsedBody.data.status.description],
              time: Number(parsedBody.data.time),
              memory: parsedBody.data.memory
          }
        })
  
  
    if (!testCase) {
      return res.status(404).json({
        message: "Testcase not found",
      });
    }
  
    const allTestCaseData = await prismaClient.testCase.findMany({
      where:{
          SubmissionId: testCase.SubmissionId
      }
    })
  
  
    const pendingTestcases = allTestCaseData.filter(
      (testcase) => testcase.status === "PENDING",
    );
    const failedTestcases = allTestCaseData.filter(
      (testcase) => testcase.status !== "AC",
    );
  
    if (pendingTestcases.length === 0) {
      const accepted = failedTestcases.length === 0;
      const response = await prismaClient.submission.update({
        where: {
          id: testCase.SubmissionId,
        },
        data: {
          status: accepted ? "AC" : "REJECTED",
          time: Math.max(
            ...allTestCaseData.map((testcase) => Number(testcase.time || "0")),
          ),
          memory: Math.max(
            ...allTestCaseData.map((testcase) => testcase.memory || 0),
          ),
        },
        include: {
          problem: true,
        }
      });
      
      }
      res.send("Received");
  
      }catch(e){
        res.status(500).send("Server error Please refresh and try again!")
      }
    })

app.get('/', (req, res)=>{
  res.send("is this running through ngrok")
})

app.listen(4000, ()=>{console.log("server started")});