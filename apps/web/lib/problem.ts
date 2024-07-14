/* eslint-disable no-unused-vars */
/* eslint-disable turbo/no-undeclared-env-vars */
import { rejects } from "assert";
import fs from "fs";
import { resolve } from "path";

type SUPPORTED_LANGS = "js" | "cpp" ;

interface Problem {
    id: string;
    fullBoilerplateCode: string;
    inputs: string[];
    outputs: string[];
  }

  
  const MOUNT_PATH = process.env.MOUNT_PATH ?? "/Users/kartikchausali/Desktop/project/code-arena-turbo/apps/problems";

  export const getProblem = async(problemId: string,languageId: SUPPORTED_LANGS,): Promise<Problem>=>{
    const fullBoilderPlate = await getFullBoilerPlateCode(
        problemId,
        languageId,
      );
      const inputs = await getProblemInputs(problemId);
      const outputs = await getProblemOutputs(problemId);
    
      return {
        id: problemId,
        fullBoilerplateCode: fullBoilderPlate,
        inputs: inputs,
        outputs: outputs,
      };
  }

  async function getFullBoilerPlateCode( problemId: string,languageId: SUPPORTED_LANGS):Promise<string>{
    
        return new Promise((resolve, reject)=>{
            fs.readFile( `${MOUNT_PATH}/${problemId}/boilerplate_full/function.${languageId}`, { encoding: "utf-8" }, (err, data) => {
                if (err) {
                  reject(err);
                }
                resolve(data);
              });
        })
  } 

  async function getProblemInputs(problemId: string):Promise<string[]>{
  
    return new Promise((resolve, reject)=>{
        fs.readdir(`${MOUNT_PATH}/${problemId}/tests/inputs`, async(err, files)=>{
            if (err) {
                console.log(err);
              } else {
                await Promise.all(files.map((file)=>{
                    return new Promise<string>((resolve, reject)=>{
                        fs.readFile(
                            `${MOUNT_PATH}/${problemId}/tests/inputs/${file}`,
                          { encoding: "utf-8" },
                          (err, data) => {
                            if (err) {
                              reject(err);
                            }
                            resolve(data);
                          },
                        );
                    }) 
                }))
                .then((data)=>{
                    resolve(data);
                })
                .catch((e)=>reject(e));
              }
        })
    })
  }

  async function getProblemOutputs(problemId: string):Promise<string[]> {
   
    return new Promise((resolve, reject) => {
        fs.readdir(
          `${MOUNT_PATH}/${problemId}/tests/outputs`,
          async (err, files) => {
            if (err) {
              console.log(err);
            } else {
              await Promise.all(
                files.map((file) => {
                  return new Promise<string>((resolve, reject) => {
                    fs.readFile(
                      `${MOUNT_PATH}/${problemId}/tests/outputs/${file}`,
                      { encoding: "utf-8" },
                      (err, data) => {
                        if (err) {
                          reject(err);
                        }
                        resolve(data);
                      },
                    );
                  });
                }),
              )
                .then((data) => {
                  resolve(data);
                })
                .catch((e) => reject(e));
            }
          },
        );
      });
  }