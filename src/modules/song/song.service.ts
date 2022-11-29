import prisma from "../../utils/prisma";
import type { CreateSongInput } from "./song.schema";

export async function createSong(
    data: CreateSongInput & { penyanyi_id: number }
) {
    return prisma.song.create({
        data,
    });
}

export function getSongs(data: { penyanyi_id: number }) {
    return prisma.song.findMany({
        where: data,
    });
}

export function getSong(data: { song_id: number; penyanyi_id: number }) {
    return prisma.song.findFirst({
        where: {
            song_id: data.song_id,
            penyanyi_id: data.penyanyi_id,
        },
    });
}

export async function updateSong(data: {
    judul: string;
    audio_path: string;
    song_id: number;
}) {
    return prisma.song.update({
        where: {
            song_id: data.song_id,
        },
        data: {
            judul: data.judul,
            audio_path: data.audio_path,
        },
    });
}

export async function deleteSong(data: { song_id: number }) {
    return prisma.song.delete({
        where: {
            song_id: data.song_id,
        },
    });
}
