import { soapClient as Soap } from "../../utils/soap";

export async function getReqSubs() {
    return await Soap.call("ListSubs", {});
}

export async function approvalSub(
    SubscriberId: number,
    CreatorId: number,
    IsApproved: boolean,
) {
    return await Soap.call("ApprovalSubs", {
        SubscriberId,
        CreatorId,
        IsApproved,
    })
}

export async function getSubsList(
    SubscriberId: number,
) {
    return await Soap.call("GetSubsList", {
        SubscriberId,
    })
}
