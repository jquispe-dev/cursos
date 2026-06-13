const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

const users = [
  { id: 1, name: 'Ana Garcia', email: 'ana@ejemplo.com' },
  { id: 2, name: 'Carlos Lopez', email: 'carlos@ejemplo.com' },
  { id: 3, name: 'Maria Perez', email: 'maria@ejemplo.com' }
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

app.get('/info', (req, res) => {
  res.json({ service: 'Backend API', version: '1.0.0' });
});

app.get('/users', (req, res) => {
  res.json({ success: true, data: users });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  res.json({ success: true, data: user });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

app.listen(PORT, () => console.log(`Backend escuchando en :${PORT}`));
