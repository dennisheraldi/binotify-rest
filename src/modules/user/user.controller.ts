import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyPassword } from "../../utils/hash";
import type { CreateUserInput, LoginInput } from "./user.schema";
import {
    createUser,
    findUserByUsername,
    findUsers,
    findAdmins,
    findPenyanyi,
} from "./user.service";
import { server } from "../../index";

export async function registerUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const user = await createUser(body);

        return reply.code(201).send(user);
    } catch (e) {
        console.log(e);
        return reply.code(500).send(e);
    }
}

export async function loginHandler(
    request: FastifyRequest<{
        Body: LoginInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    // find a user by username
    const user = await findUserByUsername(body.username);

    if (!user) {
        return reply.code(401).send({
            message: "Invalid username or password",
        });
    }

    //verify password
    const correctPassword = verifyPassword({
        candidatePassword: body.password,
        password: user.password,
    });

    if (correctPassword) {
        const { password, ...rest } = user;
        // generate access token
        return { accessToken: server.jwt.sign(rest) };
    }

    return reply.code(401).send({
        message: "Invalid username or password",
    });
}

export async function getUsersHandler() {
    const users = await findUsers();

    return users;
}

export async function getAdminsHandler() {
    const admins = await findAdmins();

    return admins;
}

export async function getPenyanyiHandler() {
    const penyanyi = await findPenyanyi();

    return penyanyi;
}
