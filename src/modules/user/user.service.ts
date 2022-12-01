import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import type { CreateUserInput } from "./user.schema";

export async function createUser(input: CreateUserInput) {
    const { password, ...rest } = input;

    const { hashedPassword } = hashPassword(password);

    const user = await prisma.user.create({
        data: { ...rest, password: hashedPassword },
    });

    return user;
}

export async function findUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: {
            username,
        },
    });
}

export async function findUsers() {
    return prisma.user.findMany({
        select: {
            user_id: true,
            email: true,
            username: true,
            name: true,
            isAdmin: true,
        },
    });
}

export async function findAdmins() {
    return prisma.user.findMany({
        where: {
            isAdmin: true,
        },
        select: {
            user_id: true,
            email: true,
            username: true,
            name: true,
            isAdmin: true,
        },
    });
}

export async function findPenyanyi() {
    return prisma.user.findMany({
        where: {
            isAdmin: false,
        },
        select: {
            user_id: true,
            email: true,
            username: true,
            name: true,
            isAdmin: true,
        },
    });
}
