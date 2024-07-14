"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputMapping = void 0;
const client_1 = require("@prisma/client");
exports.outputMapping = {
    Accepted: client_1.TestCaseResult.AC,
    "Wrong Answer": client_1.TestCaseResult.FAIL,
    "Time Limit Exceeded": client_1.TestCaseResult.TLE,
    "Memory Limit Exceeded": client_1.TestCaseResult.COMPILATION_ERROR,
    "Runtime Error (NZEC)": client_1.TestCaseResult.COMPILATION_ERROR,
    "Compilation Error": client_1.TestCaseResult.COMPILATION_ERROR,
};
