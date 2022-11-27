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

const songResponseSchema = z.object({ ...songInput, ...songGenerated });

const songsResponseSchema = z.array(songResponseSchema);

export type CreateSongInput = z.infer<typeof createSongSchema>;
export const { schemas: songSchemas, $ref } = buildJsonSchemas(
    {
        createSongSchema,
        songResponseSchema,
        songsResponseSchema,
    },
    { $id: "songSchema" }
);
