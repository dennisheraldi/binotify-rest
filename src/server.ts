// import Fastify, { FastifyReply, FastifyRequest } from "fastify";
// import fjwt, { JWT } from "@fastify/jwt";
// // import swagger from "fastify-swagger";
// // import { withRefResolver } from "fastify-zod";
// import userRoutes from "./modules/user/user.route";
// // import songRoutes from "./modules/song/song.route";
// import { userSchemas } from "./modules/user/user.schema";
// // import { songSchemas } from "./modules/song/song.schema";
// // import { version } from "../package.json";

// declare module "fastify" {
//     interface FastifyRequest {
//         jwt: JWT;
//     }
//     export interface FastifyInstance {
//         authenticate: any;
//     }
// }

// declare module "@fastify/jwt" {
//     interface FastifyJWT {
//         user: {
//             user_id: number;
//             email: string;
//             username: string;
//             name: string;
//             isAdmin: boolean;
//         };
//     }
// }

// function buildServer() {
//     const server = Fastify();

//     server.register(fjwt, {
//         secret: "mysecretandonlysecret",
//     });

//     //test fjwt

//     server.get("/test", (_, reply) => {
//         const token = server.jwt.sign({ user: "test" });
//         reply.send({ token });
//         console.log(token);
//     });

//     server.decorate(
//         "authenticate",
//         async (request: FastifyRequest, reply: FastifyReply) => {
//             try {
//                 await request.jwtVerify();
//             } catch (err) {
//                 return reply.send(err);
//             }
//         }
//     );

//     server.get("/healthcheck", async function () {
//         return { status: "OK" };
//     });

//     //   server.addHook("preHandler", (req, reply, next) => {
//     //     req.jwt = server.jwt;
//     //     return next();
//     //   });

//     for (const schema of [...userSchemas]) {
//         server.addSchema(schema);
//     }

//     //   server.register(
//     //     swagger,
//     //     withRefResolver({
//     //       routePrefix: "/docs",
//     //       exposeRoute: true,
//     //       staticCSP: true,
//     //       openapi: {
//     //         info: {
//     //           title: "Fastify API",
//     //           description: "API for some songs",
//     //           version,
//     //         },
//     //       },
//     //     })
//     //   );

//     server.register(userRoutes, { prefix: "api/users" });
//     // server.register(songRoutes, { prefix: "api/songs" });

//     return server;
// }

// export default buildServer;
