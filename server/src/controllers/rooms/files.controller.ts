import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib"

import filesService from "../../services/filesService";
import { RoomFileAttributes, RoomFilePermissions } from "room-types";

// TODO: discuss documentObject, currently returning RoomFileAttributes instead

export const getAllRoomFiles = async (req: Request, res: Response) => {
    const { roomID } = req.params;

    const roomFiles: RoomFileAttributes[] = await filesService.listAllFilesForRoom(roomID);

    res.json(roomFiles); // TODO: see top note
};

export const createFile = async (req: Request, res: Response) => {
    const { roomID } = req.params;
    const fileNameBody: Types.StringMessage = req.body;
    if (!Validation.isStringMessage(fileNameBody)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }
    
    const fileName = fileNameBody.msg;
    const fileExtension = ""; // TODO: to be discussed
    const permissions: RoomFilePermissions = { canEdit:true }; // all files default canEdit true
    const fileData: RoomFileAttributes = { roomID, fileName, fileExtension, permissions };
    const roomFile: RoomFileAttributes = await filesService.createRoomFile(fileData);

    res.json(roomFile); // TODO: see top note
};

export const getRoomFile = async (req: Request, res: Response) => {
    const { roomID, fileName } = req.params;

    const roomFile: RoomFileAttributes|null = await filesService.getFileFromRoom(roomID, fileName);
    if (!roomFile) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }
    
    res.json(roomFile);
};

// TODO: server side events
export const updateRoomFile = async (req: Request, res: Response) => {
    const { roomID } = req.params;
};

export const deleteRoomFile = async (req: Request, res: Response) => {
    const { roomID, fileName } = req.params;

    const roomFile = await filesService.getFileFromRoom(roomID, fileName);
    if (!roomFile) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }

    await filesService.deleteRoomFile(roomFile);

    res.sendStatus(204);    
};