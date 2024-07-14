"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const zod_1 = require("@repo/common/zod");
const outputMapping_1 = require("./outputMapping");
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.put('/submission-callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedBody = zod_1.submissionCallback.safeParse(req.body);
    console.log("in submission webhook");
    console.log("req body", req.body);
    if (!parsedBody.success) {
        return res.status(403).json({
            message: "Invalid input",
        });
    }
    console.log("logging status", parsedBody.data.status.description);
    console.log("logging output", parsedBody.data.stdout);
    console.log("logging token", parsedBody.data.token);
    try {
        const testCase = yield db_1.default.testCase.update({
            where: {
                judge0TrackingId: parsedBody.data.token,
            },
            data: {
                status: outputMapping_1.outputMapping[parsedBody.data.status.description],
                time: Number(parsedBody.data.time),
                memory: parsedBody.data.memory
            }
        });
        if (!testCase) {
            return res.status(404).json({
                message: "Testcase not found",
            });
        }
        const allTestCaseData = yield db_1.default.testCase.findMany({
            where: {
                SubmissionId: testCase.SubmissionId
            }
        });
        const pendingTestcases = allTestCaseData.filter((testcase) => testcase.status === "PENDING");
        const failedTestcases = allTestCaseData.filter((testcase) => testcase.status !== "AC");
        if (pendingTestcases.length === 0) {
            const accepted = failedTestcases.length === 0;
            const response = yield db_1.default.submission.update({
                where: {
                    id: testCase.SubmissionId,
                },
                data: {
                    status: accepted ? "AC" : "REJECTED",
                    time: Math.max(...allTestCaseData.map((testcase) => Number(testcase.time || "0"))),
                    memory: Math.max(...allTestCaseData.map((testcase) => testcase.memory || 0)),
                },
                include: {
                    problem: true,
                }
            });
        }
        res.send("Received");
    }
    catch (e) {
        res.status(500).send("Server error Please refresh and try again!");
    }
}));
app.get('/', (req, res) => {
    res.send("is this running through ngrok");
});
app.listen(4000, () => { console.log("server started"); });
