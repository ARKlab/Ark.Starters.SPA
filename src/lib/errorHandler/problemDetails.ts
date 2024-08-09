import { z } from "zod";

export const ProblemDetailsSchema = z
  .object({
    type: z.string().url().optional().nullable(),
    title: z.string().optional().nullable(),
    detail: z.string().optional().nullable(),
    instance: z.string().optional().nullable(),
    status: z.number().optional().nullable(),
  })
  .passthrough();

export type ProblemDetailsType = z.infer<typeof ProblemDetailsSchema>;
