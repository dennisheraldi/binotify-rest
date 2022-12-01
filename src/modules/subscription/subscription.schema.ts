import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const approvalSubsSchema = z.object({
    subscriber_id: z.number(),
    creator_id: z.number(),
    isApproved: z.boolean(),
});

export type ApprovalSubsInput = z.infer<typeof approvalSubsSchema>;


const getSubsListSchema = z.object({
    subscriber_id: z.number(),
});

export type GetSubsListInput = z.infer<typeof getSubsListSchema>;

export const { schemas: subscriptionSchemas, $ref } = buildJsonSchemas(
    {
        approvalSubsSchema,
        getSubsListSchema,
    },
    { $id: "subscriptionSchema" }
);

