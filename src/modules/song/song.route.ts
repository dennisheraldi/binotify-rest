import type { FastifyInstance } from "fastify";
import {
    createSongHandler,
    getSongsHandler,
    getSongHandler,
    updateSongHandler,
    deleteSongHandler,
} from "./song.controller";
import { $ref } from "./song.schema";

async function SongRoutes(server: FastifyInstance) {
    // Create song
    server.post(
        "/",
        {
            preHandler: [server.authenticate],
            schema: {
                body: $ref("createSongSchema"),
                response: {
                    201: $ref("songResponseSchema"),
                },
            },
        },
        createSongHandler
    );
    // Read all song
    server.get(
        "/",
        {
            preHandler: [server.authenticate],
            schema: {
                response: {
                    200: $ref("songsResponseSchema"),
                },
            },
        },
        getSongsHandler
    );

    // Read specific song by song_id
    server.get(
        "/:song_id",
        {
            preHandler: [server.authenticate],
            schema: {
                params: $ref("songIdSchema"),
                response: {
                    200: $ref("songResponseSchema"),
                },
            },
        },
        getSongHandler
    );

    // Update song
    server.put(
        "/:song_id",
        {
            preHandler: [server.authenticate],
            schema: {
                body: $ref("updateSongSchema"),
                params: $ref("songIdSchema"),
                response: {
                    200: $ref("songResponseSchema"),
                },
            },
        },
        updateSongHandler
    );

    // Delete song
    server.delete(
        "/:song_id",
        {
            preHandler: [server.authenticate],
            schema: {
                params: $ref("songIdSchema"),
                response: {
                    200: $ref("songsResponseSchema"),
                },
            },
        },
        deleteSongHandler
    );
}

export default SongRoutes;
