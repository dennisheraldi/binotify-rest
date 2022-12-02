import type { FastifyRequest, FastifyReply } from "fastify";
import type { ApprovalSubsInput, GetSubsListInput } from "./subscription.schema";
import { getReqSubs, getSubsList, approvalSub } from "./subscription.service";


export async function listSubsHandler(
    request: FastifyRequest<{}>,
    reply: FastifyReply,
) {
    if (request.user.isAdmin) {
        const subs = await getReqSubs();
        return subs;
    } else {
        return reply.code(401).send({
            "message": "Unauthorized - only admin can access"
        });
    }
}

export async function approvalSubHandler(
    request: FastifyRequest<{
        Body: ApprovalSubsInput,
    }>,
    reply: FastifyReply,
) {
    if (!request.user.isAdmin)
        return reply.code(401).send({
            "message": "Unauthorized - only admin can access"
        });
    const { subscriber_id, creator_id, isApproved } = request.body;
    const subs = await approvalSub(
        subscriber_id,
        creator_id,
        isApproved,
    );
    return subs;
}

export async function getSubsListHandler(
    request: FastifyRequest<{
        Params: GetSubsListInput,
    }>
) {
    const { subscriber_id } = request.params;
    const subs = await getSubsList(
        subscriber_id,
    );
    return subs;
}