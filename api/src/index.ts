import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const app = express();
app.use(cors({
  origin: ['http://localhost:5555', 'http://localhost:8080'],
  credentials: true,
}));
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
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Get tasks (protected)
app.get('/api/tasks', auth, async (req, res) => {
  await db.read();
  const tasks = db.data?.tasks.filter(t => t.userId === req.user.id) || [];
  res.json(tasks);
});

// Validate token (protected)
app.get('/api/validate-token', auth, async (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token is valid' 
  });
});

app.get('/api/public/tasks', async (req, res) => {
  await db.read();
  res.json(db.data?.tasks || []);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Everything is working fine' });
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

// Toggle task completion (protected)
app.put('/api/tasks/:id', auth, async (req, res) => {
  await db.read();
  const { id } = req.params;
  const { completed } = req.body;
  
  const task = db.data?.tasks.find(t => t.id === id && t.userId === req.user.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  task.completed = completed;
  await db.write();
  res.json(task);
});

// --- Start server ---
const PORT = process.env.BACKEND_PORT || 8081;
console.log("Backend Port", process.env.BACKEND_PORT);

app.listen(PORT, () => {
  console.log(`🟢 API server running at http://localhost:${PORT}`);
});

export async function runSeeder() {
  await seed();
  console.log('Seeder complete');
} 