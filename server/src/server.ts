import express, { Application, Request, Response } from 'express';
import sequelize from './db';
import routes from "./routes";

const port: number = 3000;

const app: Application = express();
app.use(express.json());
app.use(routes)

// echo: testable enpoint to check connection
app.get('/echo', (req: Request, res: Response) => {
  if(!req.body) {
    res.status(400).json({ error: "No JSON body provided" });
    return;
  }
  res.json(req.body);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);  
});

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
});