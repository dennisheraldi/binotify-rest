import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const songInput = {
    judul: z.string(),
    audio_path: z.string(),
};

const songGenerated = {
    song_id: z.number(),
};

const createSongSchema = z.object({ ...songInput });

const updateSongSchema = z.object({
    judul: z.string().optional(),
    audio_path: z.string().optional(),
});

const songResponseSchema = z.object({
    ...songInput,
    ...songGenerated,
});

const songIdSchema = z.object({
    song_id: z.number(),
});

const songsResponseSchema = z.array(songResponseSchema);

export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
export type IdSongInput = z.infer<typeof songIdSchema>;
export const { schemas: songSchemas, $ref } = buildJsonSchemas(
    {
        createSongSchema,
        updateSongSchema,
        songIdSchema,
        songResponseSchema,
        songsResponseSchema,
    },
    { $id: "songSchema" }
);
