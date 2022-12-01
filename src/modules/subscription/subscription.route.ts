import type { FastifyInstance } from "fastify";
import {
    listSubsHandler,
    approvalSubHandler,
    getSubsListHandler
} from "./subscription.controller";
import { $ref } from "./subscription.schema";

async function subscriptionRoutes(server: FastifyInstance) {
    server.get("/", {
        preHandler: [server.authenticate],
    }, listSubsHandler);

    server.put("/approve", {
        preHandler: [server.authenticate],
        schema: {
            body: $ref("approvalSubsSchema"),
        }
    }, approvalSubHandler);
    
    server.get("/subscriber/:subscriber_id", {
        schema: {
            params: $ref("getSubsListSchema")
        }
    }, getSubsListHandler);
}

export default subscriptionRoutes;