import type { FastifyRequest } from "fastify";
import type { ApprovalSubsInput, GetSubsListInput } from "./subscription.schema";
import { getReqSubs, getSubsList, approvalSub } from "./subscription.service";


export async function listSubsHandler(
    request: FastifyRequest<{}>
) {
    if (request.user.isAdmin) {
        const subs = await getReqSubs();
        return subs;
    }
}

export async function approvalSubHandler(
    request: FastifyRequest<{
        Body: ApprovalSubsInput,
    }>
) {
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