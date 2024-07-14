import {z} from 'zod'

export const submissionCallback = z.object({
    stdout: z.string().optional().nullable(),
    stderr: z.string().optional().nullable(),
    time:z.string().optional().nullable(),
    memory:z.number().optional().nullable(),
    token:z.string(),
    compile_output: z.string().nullable(),
    message: z.string().nullable(),
    status: z.object({
        id: z.number(),
        description:z.enum([
        "Accepted",
        "Rejected",
        "Runtime Error (NZEC)",
        "Compilation Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Wrong Answer",]),
    }),
});