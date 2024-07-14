"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const ProblemDefinitionGenerator_1 = require("./ProblemDefinitionGenerator");
const FullProblemDefinitionGenerator_1 = require("./FullProblemDefinitionGenerator");
function generatePartialBoilerPlate(generatorFilePath) {
    const inputFilePath = path_1.default.join(__dirname, generatorFilePath, "Structure.md");
    const boilerPlatePath = path_1.default.join(__dirname, generatorFilePath, "boilerplate");
    const input = fs_1.default.readFileSync(inputFilePath, "utf-8");
    const parser = new ProblemDefinitionGenerator_1.ProblemDefinitionParser();
    parser.parse(input);
    //Generate boiler plate code
    const cppCode = parser.generateCpp();
    const jsCode = parser.generateJs();
    if (!(0, fs_1.existsSync)(boilerPlatePath)) {
        fs_1.default.mkdirSync(boilerPlatePath, { recursive: true });
    }
    fs_1.default.writeFileSync(path_1.default.join(boilerPlatePath, "function.cpp"), cppCode);
    fs_1.default.writeFileSync(path_1.default.join(boilerPlatePath, "function.js"), jsCode);
    console.log("Boilder plate code generated successfully");
}
function generateFullBoilerPlate(generatorFilePath) {
    const inputFilePath = path_1.default.join(__dirname, generatorFilePath, "Structure.md");
    const boilerPlatePath = path_1.default.join(__dirname, generatorFilePath, "boilerplate_full");
    const input = fs_1.default.readFileSync(inputFilePath, "utf-8");
    const parser = new FullProblemDefinitionGenerator_1.FullProblemDefinitionParser();
    parser.parse(input);
    const cppCode = parser.generateCpp();
    const jsCode = parser.generateJs();
    if (!fs_1.default.existsSync(boilerPlatePath)) {
        fs_1.default.mkdirSync(boilerPlatePath, { recursive: true });
    }
    fs_1.default.writeFileSync(path_1.default.join(boilerPlatePath, "function.cpp"), cppCode);
    fs_1.default.writeFileSync(path_1.default.join(boilerPlatePath, "function.js"), jsCode);
    console.log("full boilerPlate code generated successfully");
}
generatePartialBoilerPlate((_a = process.env.GENERATOR_FILE_PATH) !== null && _a !== void 0 ? _a : "");
generateFullBoilerPlate((_b = process.env.GENERATOR_FILE_PATH) !== null && _b !== void 0 ? _b : "");
