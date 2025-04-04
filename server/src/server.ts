import express, { Application, Request, Response } from 'express';
import expressWs from 'express-ws';
import sequelize from './db';
import routerWs from './websockets/socketHandler';
import routes from "./routes";
import UserService from './services/userService';
import fs from 'fs';
import { ErrorHandler } from './middleware/errorCatcher';

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

app.use(ErrorHandler);

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
  }).then(() => {
    console.log('Admin user created');
  });
});

if (USER_FILES) {
  for (const file of fs.readdirSync(USER_FILES)) {
    fs.rmSync(`${USER_FILES}/${file}`);
  }
}