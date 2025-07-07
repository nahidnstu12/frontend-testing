import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'supersecret'; // Use env in real apps

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

// --- LowDB setup ---
type User = { id: string; username: string; password: string };
type Task = { id: string; userId: string; title: string; completed: boolean };
type Data = { users: User[]; tasks: Task[] };

const db = new Low<Data>(new JSONFile<Data>('api/db.json'), {
  users: [],
  tasks: [],
});

// --- Seeder ---
async function seed() {
  await db.read();
  if (!db.data) db.data = { users: [], tasks: [] };

  if (db.data.users.length === 0) {
    const password = await bcrypt.hash('password', 10);
    db.data.users.push({ id: '1', username: 'jhon', password });
    db.data.users.push({ id: '2', username: 'mike', password });
    db.data.tasks.push(
      { id: '1', userId: '1', title: 'First Task', completed: false },
      { id: '2', userId: '1', title: 'Second Task', completed: true },
      { id: '3', userId: '1', title: 'Third Task', completed: false },
      { id: '4', userId: '1', title: 'Fourth Task', completed: true },
      { id: '5', userId: '2', title: 'Fifth Task', completed: false },
      { id: '6', userId: '2', title: 'Sixth Task', completed: true },
      { id: '7', userId: '2', title: 'Seventh Task', completed: false },
      { id: '8', userId: '2', title: 'Eighth Task', completed: true },
      { id: '9', userId: '2', title: 'Ninth Task', completed: false },
      { id: '10', userId: '1', title: 'Tenth Task', completed: true }
    );
    await db.write();
  }
}

// --- Auth Middleware ---
function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET) as JwtPayload & { id: string; username: string };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Routes ---

// Login
app.post('/api/login', async (req, res) => {
  await db.read();
  const { username, password } = req.body;
  const user = db.data?.users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Get tasks (protected)
app.get('/api/tasks', auth, async (req, res) => {
  await db.read();
  const tasks = db.data?.tasks.filter(t => t.userId === req.user.id) || [];
  res.json(tasks);
});

// Add task (protected)
app.post('/api/tasks', auth, async (req, res) => {
  await db.read();
  const { title } = req.body;
  const newTask = { id: Date.now().toString(), userId: req.user.id, title, completed: false };
  db.data?.tasks.push(newTask);
  await db.write();
  res.status(201).json(newTask);
});

// --- Start server ---
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🟢 API server running at http://localhost:${PORT}`);
});

export async function runSeeder() {
  await seed();
  console.log('Seeder complete');
} 