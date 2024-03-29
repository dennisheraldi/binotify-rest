import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt from "@fastify/jwt";
// import swagger from "@fastify/swagger";
// import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import songRoutes from "./modules/song/song.route";
import { userSchemas } from "./modules/user/user.schema";
import { songSchemas } from "./modules/song/song.schema";
import { subscriptionSchemas } from "./modules/subscription/subscription.schema";
import multer from "fastify-multer";
import subscriptionRoutes from "./modules/subscription/subscription.route";
// import { version } from "../package.json";

export const server = Fastify();

// Allow CORS
server.register(require("@fastify/cors"), {
    origin: true,
    credentials: true,
});

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            user_id: number;
            email: string;
            username: string;
            name: string;
            isAdmin: boolean;
        };
    }
}

server.register(fjwt, {
    secret: "theonlysecret",
    sign: {
        expiresIn: "2h",
    }
});

server.register(multer.contentParser);

server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (e) {
            return reply.send(e);
        }
    }
);

server.get("/healthcheck", async function () {
    return { status: "OK" };
});

async function main() {
    for (const schema of [...userSchemas, ...songSchemas, ...subscriptionSchemas]) {
        server.addSchema(schema);
    }

    // server.register(swagger, {
    //     routePrefix: "/doc",
    //     swagger: {
    //         info: {
    //             title: "Fastify API",
    //             description: "API for some products",
    //             version: "1.0.0",
    //         },
    //         securityDefinitions: {
    //             apiKey: {
    //                 type: "apiKey",
    //                 name: "apiKey",
    //                 in: "header",
    //             },
    //         },
    //         host: "localhost:3000",
    //         schemes: ["http"],
    //         consumes: ["application/json"],
    //         produces: ["application/json"],
    //     },
    //     hideUntagged: true,
    //     exposeRoute: true,
    // });

    server.register(userRoutes, { prefix: "api/users" });
    server.register(songRoutes, { prefix: "api/songs" });
    server.register(subscriptionRoutes, { prefix: "api/subscriptions" });

    try {
        await server.listen({ host: "0.0.0.0", port: 3000 });

        console.log(`Server ready at http://localhost:3000`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
