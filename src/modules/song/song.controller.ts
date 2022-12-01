import type { FastifyRequest } from "fastify";
import type {
    CreateSongInput,
    UpdateSongInput,
    IdSongInput,
    PenyanyiIdSongInput,
} from "./song.schema";
import {
    createSong,
    getSongs,
    getSong,
    updateSong,
    deleteSong,
} from "./song.service";
import fs from "fs";

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

export async function getSongsHandler(request: FastifyRequest<{}>) {
    const songs = await getSongs({
        penyanyi_id: request.user.user_id,
    });

    return songs;
}

export async function getSongHandler(
    request: FastifyRequest<{
        Params: IdSongInput;
    }>
) {
    const song = await getSong({
        song_id: request.params.song_id,
        penyanyi_id: request.user.user_id,
    });
    return song;
}

export async function getSongByPenyanyi(
    request: FastifyRequest<{
        Params: PenyanyiIdSongInput;
    }>
) {
    const song = await getSongs({
        penyanyi_id: request.params.penyanyi_id,
    });
    return song;
}

export async function updateSongHandler(
    request: FastifyRequest<{
        Body: UpdateSongInput;
        Params: IdSongInput;
    }>
) {
    // Check if song exists
    const fetchSong = await getSong({
        song_id: request.params.song_id,
        penyanyi_id: request.user.user_id,
    });

    if (!fetchSong) {
        throw new Error("Song not found");
    } else {
        // assign value of judul and audio path based on fetch and request body
        const judul = request.body.judul || fetchSong.judul;
        // Delete song if body audio path available
        if (request.body.audio_path) {
            fs.unlinkSync(fetchSong.audio_path);
        }
        const audio_path = request.body.audio_path || fetchSong.audio_path;
        const song_id = request.params.song_id;
        const song = await updateSong({ judul, audio_path, song_id });
        return song;
    }
}

export async function deleteSongHandler(
    request: FastifyRequest<{
        Params: IdSongInput;
    }>
) {
    // Check if song exists
    const fetchSong = await getSong({
        song_id: request.params.song_id,
        penyanyi_id: request.user.user_id,
    });

    if (!fetchSong) {
        throw new Error("Song not found");
    } else {
        // Delete file
        fs.unlinkSync(fetchSong.audio_path);

        await deleteSong({ song_id: request.params.song_id });
        // return success message
        return getSongs({ penyanyi_id: request.user.user_id });
    }
}
