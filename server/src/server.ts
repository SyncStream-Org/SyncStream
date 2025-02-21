import express, { Application, Request, Response } from 'express';
import sequelize from './db';
import routes from "./routes";
import UserService from './services/userService';

const port: number = 3000;
const ADMIN_USERNAME = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin';

const app: Application = express();
app.use(express.json());
app.use(routes)

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