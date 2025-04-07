import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib"
import filesService from "../../services/filesService";
import RoomFile from "src/models/roomFiles";
import Broadcaster from "../../utils/broadcaster";

// TODO: discuss documentObject, currently returning RoomFileAttributes instead

export const getAllRoomFiles = async (req: Request, res: Response) => {
    const { roomID } = req.params;

    const roomFiles: RoomFile[] = await filesService.listAllFilesForRoom(roomID);
    
    if (!roomFiles.length) {
        res.sendStatus(204);
        return;
    }
    
    const roomFilesResponse: Types.FileData[] = roomFiles.map((file) => ({
        fileID: file.fileID,
        fileName: file.fileName,
        fileExtension: file.fileExtension,
        permissions: file.permissions,
    }));
    res.json(roomFilesResponse); // TODO: see top note
};

export const createFile = async (req: Request, res: Response) => {
    const { roomID } = req.params;

    const fileBody: Types.FileData = req.body;
    if (!Validation.isFileDataCreation(fileBody)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }

    const roomFile: RoomFile = await filesService.createRoomFile({ roomID, ...fileBody });
    const roomFileResponse: Types.FileData = {
        fileID: roomFile.fileID,
        fileName: roomFile.fileName,
        fileExtension: roomFile.fileExtension,
        permissions: roomFile.permissions,
    };

    Broadcaster.pushUpdateToUsers(
        roomID,
        {
            endpoint: 'media',
            type: 'create', 
            data: roomFileResponse,
        }
    );
    res.json(roomFileResponse); // TODO: see top note
};

export const getRoomFile = async (req: Request, res: Response) => {
    const { roomID, fileName } = req.params;

    const roomFile: RoomFile | null = await filesService.getFileFromRoom(roomID, fileName);
    if (!roomFile) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }

    const roomFileResponse: Types.FileData = {
        fileID: roomFile.fileID,
        fileName: roomFile.fileName,
        fileExtension: roomFile.fileExtension,
        permissions: roomFile.permissions,
    };

    res.json(roomFileResponse);
};

// TODO: server side events
export const updateRoomFile = async (req: Request, res: Response) => {
    // TODO: requires further developing as a group on what it means to join room
    const { roomID, fileName } = req.params;
    const roomFile = await filesService.getFileFromRoom(roomID, fileName);
    if (!roomFile) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }
    const updateBody: Types.FileDataUpdate = req.body;
    if (!Validation.isFileDataUpdate(updateBody)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }
    
    const updatedRoomFile: RoomFile = await filesService.updateRoomFile(roomFile, updateBody);
    const roomFileResponse: Types.FileData = {
        fileID: updatedRoomFile.fileID,
        fileName: updatedRoomFile.fileName,
        fileExtension: updatedRoomFile.fileExtension,
        permissions: updatedRoomFile.permissions,
    };

    Broadcaster.pushUpdateToUsers(
        roomID,
        {
            endpoint: 'media',
            type: 'update', 
            data: roomFileResponse,
        }
    );

    res.sendStatus(204);
};

export const deleteRoomFile = async (req: Request, res: Response) => {
    const { roomID, fileName } = req.params;

    const roomFile = await filesService.getFileFromRoom(roomID, fileName);
    if (!roomFile) {
        res.status(404).json({ error: "Not Found: file" });
        return;
    }

    await filesService.deleteRoomFile(roomFile);

    Broadcaster.pushUpdateToUsers(
        roomID,
        {
            endpoint: 'media',
            type: 'delete', 
            data: roomFile,
        }
    );
    res.sendStatus(204);    
};