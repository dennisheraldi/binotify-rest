import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt from "@fastify/jwt";
// import swagger from "fastify-swagger";
// import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
// import songRoutes from "./modules/song/song.route";
import { userSchemas } from "./modules/user/user.schema";
import { songSchemas } from "./modules/song/song.schema";
// import { version } from "../package.json";

export const server = Fastify();

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
});

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
    for (const schema of [...userSchemas, ...songSchemas]) {
        server.addSchema(schema);
    }

    // server.register(
    //     swagger,
    //     withRefResolver({
    //         routePrefix: "/docs",
    //         exposeRoute: true,
    //         staticCSP: true,
    //         openapi: {
    //             info: {
    //                 title: "Fastify API",
    //                 description: "API for some songs",
    //                 version,
    //             },
    //         },
    //     })
    // );

    server.register(userRoutes, { prefix: "api/users" });
    // server.register(songRoutes, { prefix: "api/songs" });

    try {
        await server.listen({ port: 3000 });

        console.log(`Server ready at http://localhost:3000`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
