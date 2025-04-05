import express from 'express';
import expressWs from 'express-ws';
import sequelize from './db';
import routerWs from './websockets/routes';
import routes from "./routes";
import UserService from './services/userService';
import fs from 'fs';
import roomService from './services/roomService';
import filesService from './services/filesService';
import cleanup from './utils/cleanup';

const port: number = 3000;
const ADMIN_USERNAME = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin';
const USER_FILES = process.env.USER_FILES;

// Create an Express application
const app = expressWs(express()).app;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(routerWs);
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);  
});

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
  UserService.createUser({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
    email: ADMIN_EMAIL,
    displayName: 'Admin',
    admin: true,
  }).then(async () => {
    console.log('Admin user created');
    // create a room, create a file, then delete the room
    const room = await roomService.createRoom({
      roomName: 'Test Room',
      roomOwner: ADMIN_USERNAME,
    });
    console.log('Test room created');
    const file = await filesService.createRoomFile({
      roomID: room.roomID,
      fileName: 'Test File',
      fileExtension: 'txt',
      permissions: {
        canEdit: true,
      },
    });
    console.log('Test file created');
    // list all files 
    let files = await filesService.listAllFiles();
    console.log('All files:', files);
    // delete the room
    // await roomService.deleteRoom(room);
    // console.log('Test room deleted');
    // // list all files
    // files = await filesService.listAllFiles();
    // console.log('All files:', files);
    // delete the file
    await filesService.deleteRoomFile(file);
  });
});

if (USER_FILES) {
  for (const file of fs.readdirSync(USER_FILES)) {
    fs.rmSync(`${USER_FILES}/${file}`);
  }
}

cleanup();