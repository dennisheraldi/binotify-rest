import prisma from "../../utils/prisma";
import type { CreateSongInput } from "./song.schema";

export async function createSong(
    data: CreateSongInput & { penyanyi_id: number }
) {
    return prisma.song.create({
        data,
    });
}

export function getSongs() {
    return prisma.song.findMany({
        select: {
            song_id: true,
            judul: true,
            penyanyi_id: true,
            audio_path: true,
            penyanyi: {
                select: {
                    username: true,
                    name: true,
                    user_id: true,
                },
            },
        },
    });
}
