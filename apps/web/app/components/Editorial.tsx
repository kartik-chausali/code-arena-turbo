"use client"

import { useEffect, useState } from "react"
import LanguageLabel from "./label";
import {Editor} from '@monaco-editor/react'
import { LANGUAGE_MAPPING } from "@repo/common/language";

export function Editorial({problem}:any){
    const [language, setLanguage] = useState(Object.keys(LANGUAGE_MAPPING)[0] as string,);
    const [code , setCode] = useState<Record<string, string>>({});
    
    useEffect(()=>{
       
        const editorialCode :{[key:string]:string} ={};
        problem.EditorialCode.forEach((code :any)=>{
            const lang = Object.keys(LANGUAGE_MAPPING).find(
                (language)=>LANGUAGE_MAPPING[language]?.internal == code.languageId,
            );
            if(!lang)return 
            editorialCode[lang] = code.code
        })
        setCode(editorialCode)

    }, [problem])
    
    console.log("logging editorial ", code);

    return <div>
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
          }}
          defaultValue={code[language]}
          />
          
       </div>
    </div>
}