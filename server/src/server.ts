import express, { Application, Request, Response } from 'express';
import expressWs from 'express-ws';
import sequelize from './db';
import routerWs from './websockets/socketHandler';
import routes from "./routes";
import UserService from './services/userService';

const port: number = 3000;
const ADMIN_USERNAME = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin';

// Create an Express application
const app = expressWs(express()).app;
// const app = express();
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
  }).then(() => {
    console.log('Admin user created');
  });
});