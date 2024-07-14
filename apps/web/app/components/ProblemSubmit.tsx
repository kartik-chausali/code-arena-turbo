/* eslint-disable no-unused-vars */
"use client"
import {Tabs } from "../utils/tabs"
import { act, useEffect, useState } from "react"
import {LANGUAGE_MAPPING} from '@repo/common/language'
import LanguageLabel from '../components/label'
import { Editor } from "@monaco-editor/react"
import { SubmitButton } from "../utils/submitButton"
import { useSession, signIn } from "next-auth/react"
import { CheckIcon, CircleX, ClockIcon } from "lucide-react";
import {toast} from 'react-toastify'

import axios from "axios"
import { SubmissionTable } from "./SubmissionTable"
import { Editorial } from "./Editorial"
interface ProblemType{
    id:string,
    tittle:string,
    description:string,
    DefaultCode:{
        languageId:number,
        code:string, 
    }[]
}

export interface ISubmission {
    id: string;
    time: string;
    memory: string;
    problemId: string;
    languageId: string;
    code: string;
    fullCode: string;
    status: string;
    testcases: {
      status: string;
      index: number;
    }[];
  }

enum SubmitStatus {
    SUBMIT = "SUBMIT",
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    FAILED = "FAILED",
  }

export function ProblemSubmit({problem}:{problem:ProblemType}){

    const [activeTab, setActiveTab] = useState('problem');
    
    useEffect(()=>{
      console.log("which tab it is ", activeTab)
    },[activeTab])

        return <div className="flex flex-col items-start">
            <Tabs setActiveTab={setActiveTab}/>
            <div className={`${activeTab === "problem" ? "" : "hidden"}`}>
                <SubmitProblem problem={problem}/>
            </div>
            {activeTab === 'submissions' && <Submissions problem={problem}/>}
            {activeTab === 'editorial' && <Editorial problem={problem}/>}
        </div>
}


function SubmitProblem({problem}:{problem:ProblemType}){

    const languages = [{
        name:'CPP'
    },{name:'Javascript'}]

    const [language, setLanguage] = useState(Object.keys(LANGUAGE_MAPPING)[0] as string,);
    const [code , setCode] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<string>(SubmitStatus.SUBMIT);
    const [testcases, setTestcases] = useState<any[]>([]);
    const session = useSession();
    useEffect(()=>{
       
        const defaultCode :{[key:string]:string} ={};
        problem.DefaultCode.forEach((code)=>{
            const lang = Object.keys(LANGUAGE_MAPPING).find(
                (language)=>LANGUAGE_MAPPING[language]?.internal == code.languageId,
            );
            if(!lang)return 
            defaultCode[lang] = code.code
        })
        setCode(defaultCode)

    }, [problem])


    async function pollWithBackoff(id: string, retries: number){
        if (retries === 0) {
            setStatus(SubmitStatus.FAILED);
            toast.error("Not able to get status ");
            return;
          }

          console.log('made api call with submission id')
          const response = await axios.get(`/api/submission/?id=${id}`);
          console.log("response is ", response);
          console.log("status is " , response.data.submission.status);

          if(response.data.submission.status === 'PENDING'){
            setTestcases(response.data.testCases);
            console.log('inside if of pollwithbackoff')
            await new Promise((resolve) => setTimeout(resolve, 2.5 * 1000));
            pollWithBackoff(id, retries - 1);
          }else{
            console.log('inside else of pollwithbackoff')
            if(response.data.submission.status === 'AC'){
                console.log('status if AC')
                setStatus(SubmitStatus.ACCEPTED);
                setTestcases(response.data.testCases);
                toast.success("Accepted!");
                return;
            }else{
                console.log('status failed')
                setStatus(SubmitStatus.FAILED);
                toast.error("Failed :(");
                setTestcases(response.data.testCases);
                return;
            }
          }
    }

    async function submit(){
        setStatus(SubmitStatus.PENDING)
        setTestcases(t => t.map(tc => ({...tc, status:"PENDING"})));
        const response = await axios.post(`/api/submission/`, {
            code: code[language],
            languageId: language,
            problemId: problem.id, 
          })
          pollWithBackoff(response.data.id, 10);
    }
    

    return <div className="mt-2">
       <LanguageLabel setLanguageForMain={setLanguage}/>
       <div className="pt-4 rounded-full">
        <Editor value={code[language]}
        height={"70vh"}
        theme="vs-dark"
        onMount={() => {}}
        language={LANGUAGE_MAPPING[language]?.monaco}
        defaultLanguage="javascript"
        width={"80vh"}
        options={{
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
          onChange={(value)=>{
            //@ts-ignore
            setCode({...code, [language]:value})
          }}/>
       </div>
       <div className="flex justify-end">
        <SubmitButton disabled={status === SubmitStatus.PENDING}
        type="submit"
        classname="mt-4 align-right"
        onClick={session.data?.user ? submit : () => signIn()}>
            {session.data?.user ? (status === SubmitStatus.PENDING ? "Submitting" : "Submit") : "Login to submit"}
        </SubmitButton>
       </div>
        <RenderTestCases testcases={testcases}/>
    </div>
    
}

function renderResult(status: string){
    switch(status){
        case "AC":
            return <CheckIcon className="h-6 w-6 text-green-500" />;
          case "FAIL":
            return <CircleX className="h-6 w-6 text-red-500" />;
          case "TLE":
            return <ClockIcon className="h-6 w-6 text-red-500" />;
          case "COMPILATION_ERROR":
            return <CircleX className="h-6 w-6 text-red-500" />;
          case "PENDING":
            return <ClockIcon className="h-6 w-6 text-yellow-500" />;
          default:
            return <div className="text-gray-500"></div>;
    }
}


function RenderTestCases({testcases}:{testcases:any[]}){
    return <div className="grid grid-cols-6 gap-4">
    {testcases.map((testcase, index) => (
      <div key={index} className="border rounded-md">
        <div className="px-2 pt-2 flex justify-center">
          <div className="">Test #{index + 1}</div>
        </div>
        <div className="p-2 flex justify-center">
          {renderResult(testcase.status)}
        </div>
      </div>
    ))}
  </div>
}

function Submissions({problem}:{problem:ProblemType}){
    const [submissions, setSubmissions] = useState<ISubmission[]>([]);
   useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/api/submission/bulk?problemId=${problem.id}`,
      );
      setSubmissions(response.data.submissions);
    };
    fetchData();
  }, []);

  
  if(submissions.length == 0){
    console.log("inside if")
    return <div>
      loading
    </div>
  }else {
    console.log("logging submission in else ", submissions.length)
  return (
<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    SubmissionId
                </th>
                <th scope="col" className="px-6 py-3">
                    Result
                </th>
                <th scope="col" className="px-6 py-3">
                    Time
                </th>
                <th scope="col" className="px-6 py-3">
                    Memory
                </th>
            </tr>
        </thead>
        <tbody>
        {submissions.map((submission)=>(
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {submission.id}
          </th>
          <td className="px-6 py-4">
              {submission.status}
          </td>
          <td className="px-6 py-4">
              {submission.time}
          </td>
          <td className="px-6 py-4">
             {submission.memory}
          </td>
      </tr>
        ))}
        </tbody>
    </table>
</div>

  );
}
}