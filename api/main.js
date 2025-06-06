

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (temporary for development)
let tasks = [];

// Routes
app.get('/api/user/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/user/tasks', (req, res) => {
  const { name, type } = req.body;
  const newTask = {
    id: Date.now().toString(),
    name,
    type,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/user/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    task.completed = true;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/user/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});