import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .email(),
    name: z.string(),
    username: z.string(),
    isAdmin: z.boolean().default(false),
};

const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }),
});

const createUserResponseSchema = z.object({
    user_id: z.number(),
    ...userCore,
});

const loginSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }),
    password: z.string(),
});

const loginResponseSchema = z.object({
    accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
    {
        createUserSchema,
        createUserResponseSchema,
        loginSchema,
        loginResponseSchema,
    },
    { $id: "userSchema" }
);
