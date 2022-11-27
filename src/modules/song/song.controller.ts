import type { FastifyRequest } from "fastify";
import type { CreateSongInput } from "./song.schema";
import { createSong, getSongs } from "./song.service";

export async function createSongHandler(
    request: FastifyRequest<{
        Body: CreateSongInput;
    }>
) {
    const song = await createSong({
        ...request.body,
        penyanyi_id: request.user.user_id,
    });

    return song;
}

export async function getSongsHandler() {
    const songs = await getSongs();

    return songs;
}
