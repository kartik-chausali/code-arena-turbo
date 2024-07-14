import fs, { existsSync } from 'fs'
import path, { parse } from 'path'
import {ProblemDefinitionParser} from './ProblemDefinitionGenerator'
import {FullProblemDefinitionParser} from './FullProblemDefinitionGenerator'
function generatePartialBoilerPlate(generatorFilePath: string){
    const inputFilePath  = path.join(__dirname, generatorFilePath, "Structure.md");
    const boilerPlatePath = path.join(__dirname, generatorFilePath, "boilerplate");

    const input = fs.readFileSync(inputFilePath, "utf-8");

    const parser = new ProblemDefinitionParser();
    parser.parse(input);

    //Generate boiler plate code
    const cppCode = parser.generateCpp();
    const jsCode = parser.generateJs();

    if(!existsSync(boilerPlatePath)){
        fs.mkdirSync(boilerPlatePath, {recursive:true});
    }

    fs.writeFileSync(path.join(boilerPlatePath, "function.cpp"), cppCode);
    fs.writeFileSync(path.join(boilerPlatePath, "function.js"), jsCode);

    console.log("Boilder plate code generated successfully");
    
}

function generateFullBoilerPlate(generatorFilePath:string){
    const inputFilePath = path.join(__dirname, generatorFilePath, "Structure.md");
    const boilerPlatePath = path.join(__dirname, generatorFilePath, "boilerplate_full");

    const input = fs.readFileSync(inputFilePath, "utf-8");
    const parser = new FullProblemDefinitionParser();
    parser.parse(input);

    const cppCode = parser.generateCpp();
    const jsCode = parser.generateJs();

    if(!fs.existsSync(boilerPlatePath)){
        fs.mkdirSync(boilerPlatePath, {recursive:true});
    }

    fs.writeFileSync(path.join(boilerPlatePath, "function.cpp"), cppCode);
    fs.writeFileSync(path.join(boilerPlatePath, "function.js"), jsCode);

    console.log("full boilerPlate code generated successfully");
}

generatePartialBoilerPlate(process.env.GENERATOR_FILE_PATH ?? "");
generateFullBoilerPlate(process.env.GENERATOR_FILE_PATH ?? "");