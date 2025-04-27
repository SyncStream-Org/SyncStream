import express from "express";
import expressWs from "express-ws";
import sequelize from "./db";
import routerWs from "./websockets/routes";
import routes from "./routes";
import UserService from "./services/userService";
import fs from "fs";
import cleanup from "./utils/cleanup";

import { ErrorHandler } from "./middleware/errorCatcher";
import cors from "cors";

const port: number = 3000;
const ADMIN_USERNAME = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || "admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin";
const USER_FILES = process.env.USER_FILES;

// Create an Express application
const app = expressWs(express()).app;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(routerWs);
app.use(routes);

app.use(ErrorHandler);

/* number of proxies between user and server, needed for https proxy */
app.set("trust proxy", 1);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");

  UserService.createUser({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
    email: ADMIN_EMAIL,
    displayName: "Admin",
    admin: true,
    isPasswordAuto: false,
  })
    .then(async () => {
      console.log("Admin user created");
    })
    .catch(() => {
      console.log("Admin user is already exists");
    });
});

if (USER_FILES) {
  for (const file of fs.readdirSync(USER_FILES)) {
    fs.rmSync(`${USER_FILES}/${file}`);
  }
}

cleanup();
