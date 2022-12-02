import type { FastifyInstance } from "fastify";
import {
    createSongHandler,
    getSongsHandler,
    getSongHandler,
    updateSongHandler,
    deleteSongHandler,
    getSongByPenyanyi,
} from "./song.controller";
import { $ref } from "./song.schema";
import multer from "fastify-multer";

declare module "fastify" {
    interface FastifyRequest {
        file: any;
    }
}

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, "./public/audio");
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: storage });

let fieldsUpload = upload.single("file");

async function SongRoutes(server: FastifyInstance) {
    // Create song
    server.post(
        "/",
        {
            preHandler: [server.authenticate, fieldsUpload],
            schema: {
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
        "/:song_id/:penyanyi_id",
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

    // Read specific song by penyanyi_id
    server.get(
        "/:penyanyi_id",
        {
            schema: {
                params: $ref("songPenyanyiIdSchema"),
            },
        },
        getSongByPenyanyi
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
