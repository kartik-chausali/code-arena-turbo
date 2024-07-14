import fs from 'fs'
import { prismaClient } from '../src';
import {LANGUAGE_MAPPING} from '@repo/common/language'

const MOUNT_PATH = process.env.MOUNT_PATH ?? "../../apps/problems";

function promisifiedReadFile(path:string):Promise<string>{

    return new Promise((resolve, reject)=>{

        fs.readFile(path, "utf-8", (err, data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })

}

async function main(problemSlug: string , problemTittle:string){
    const problemStatement = await promisifiedReadFile(`${MOUNT_PATH}/${problemSlug}/Problem.md`);

    const problem = await prismaClient.problem.upsert({
        where:{
            slug:problemSlug
        },
        create:{
            tittle: problemSlug,
            slug: problemSlug, 
            description: problemStatement,
        },
        update:{
            description: problemStatement
        }
    });


    await Promise.all(
        Object.keys(LANGUAGE_MAPPING).map(async(language)=>{
        const code  =  await promisifiedReadFile(`${MOUNT_PATH}/${problemSlug}/boilerplate/function.${language}`);
        await prismaClient.defaultCode.upsert({
            where:{
                problemId_languageId:{
                    problemId: problem.id,
                    languageId:LANGUAGE_MAPPING[language].internal
                }
            },
            create:{
                problemId: problem.id,
                languageId:LANGUAGE_MAPPING[language].internal,
                code:code
            },
            update:{
                code:code
            }
        })
        })
    )

    await Promise.all(
        Object.keys(LANGUAGE_MAPPING).map(async (language)=>{
            const editorial = await promisifiedReadFile(`${MOUNT_PATH}/${problemSlug}/editorial/function.${language}`);
            await prismaClient.editorialCode.upsert({
                where:{
                    problemId_languageId:{
                        problemId:problem.id,
                        languageId:LANGUAGE_MAPPING[language].internal,
                    },
                },
                    create:{
                        problemId: problem.id,
                        languageId: LANGUAGE_MAPPING[language].internal,
                        code: editorial
                        
                    },
                    update:{
                        code:editorial
                    }
                
            })
        })
    )
}

export function addProblemsInDb(){
    fs.readdir(MOUNT_PATH, (err, dirs)=>{
        if(err){
            console.log("Error reading directory: ", err);
            return;
        }
        dirs.forEach(async (dir)=>{
            await main(dir, dir)
        })
    })
}

addProblemsInDb();