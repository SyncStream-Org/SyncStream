import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib"
import mediaService from "../services/mediaService";
import RoomMedia from "src/models/roomMedia";
import Broadcaster from "../utils/broadcaster";

export const getAllRoomMedia = async (req: Request, res: Response) => {
    const { roomID } = req.params;

    const roomMedia: RoomMedia[] = await mediaService.listAllMediaForRoom(roomID);
    
    if (!roomMedia.length) {
        res.sendStatus(204);
        return;
    }
    
    const roomMediaResponse: Types.MediaData[] = roomMedia.map((media) => ({
        mediaID: media.mediaID,
        mediaName: media.mediaName,
        mediaType: media.mediaType,
        permissions: media.permissions,
    }));
    res.json(roomMediaResponse);
};

export const createMedia = async (req: Request, res: Response) => {
    const { roomID } = req.params;

    const mediaBody: Types.MediaData = req.body;
    if (!Validation.isMediaDataCreation(mediaBody)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }

    const roomMedia: RoomMedia = await mediaService.createRoomMedia({ roomID, ...mediaBody });
    const roomMediaResponse: Types.MediaData = {
        mediaID: roomMedia.mediaID,
        mediaName: roomMedia.mediaName,
        mediaType: roomMedia.mediaType,
        permissions: roomMedia.permissions,
    };

    Broadcaster.pushUpdateToRoom(
        roomID,
        {
            endpoint: 'media',
            type: 'create', 
            data: roomMediaResponse,
        }
    );
    res.json(roomMediaResponse);
};

export const getRoomMedia = async (req: Request, res: Response) => {
    const { roomID, mediaName } = req.params;

    const roomMedia: RoomMedia | null = await mediaService.getMediaFromRoom(roomID, mediaName);
    if (!roomMedia) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }

    const roomMediaResponse: Types.MediaData = {
        mediaID: roomMedia.mediaID,
        mediaName: roomMedia.mediaName,
        mediaType: roomMedia.mediaType,
        permissions: roomMedia.permissions,
    };

    res.json(roomMediaResponse);
};

export const updateRoomMedia = async (req: Request, res: Response) => {
    const { roomID, mediaID } = req.params;
    const roomMedia = await mediaService.getMediaByID(roomID, mediaID);
    if (!roomMedia) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }
    const updateBody: Types.MediaDataUpdate = req.body;
    if (!Validation.isMediaDataUpdate(updateBody)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }
    
    const updatedRoomMedia: RoomMedia = await mediaService.updateRoomMedia(roomMedia, updateBody);
    const roomMediaResponse: Types.MediaData = {
        mediaID: updatedRoomMedia.mediaID,
        mediaName: updatedRoomMedia.mediaName,
        mediaType: updatedRoomMedia.mediaType,
        permissions: updatedRoomMedia.permissions,
    };

    Broadcaster.pushUpdateToRoom(
        roomID,
        {
            endpoint: 'media',
            type: 'update', 
            data: roomMediaResponse,
        }
    );

    res.sendStatus(204);
};

export const deleteRoomMedia = async (req: Request, res: Response) => {
    const { roomID, mediaID } = req.params;

    const roomMedia = await mediaService.getMediaByID(roomID, mediaID);
    if (!roomMedia) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }

    await mediaService.deleteRoomMedia(roomMedia);

    Broadcaster.pushUpdateToRoom(
        roomID,
        {
            endpoint: 'media',
            type: 'delete', 
            data: roomMedia,
        }
    );
    res.sendStatus(204);    
};