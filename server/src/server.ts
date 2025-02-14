import express, { Application, Request, Response } from 'express';
import sequelize from './db';

const port: number = 3000;

const app: Application = express();
app.use(express.json());

// 
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);  
});

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
});