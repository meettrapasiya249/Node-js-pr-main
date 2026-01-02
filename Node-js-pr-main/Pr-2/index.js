const express = require('express');
const app = express();
const PORT = 8081;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

let todos = [
  {
    id: generateId(),
    title: 'Buy groceries',
    description: 'Milk, Bread, Eggs',
    date: '2026-01-05',
    time: '09:00',
    priority: 'High',
    status: 'Pending',
    createdAt: new Date().toLocaleString()
  }
];
 
app.get('/', (req, res) => {
  res.render('index', { todos });
});
 
app.post('/add-todo', (req, res) => {
  const newTodo = {
    id: generateId(),
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    priority: req.body.priority,
    status: req.body.status,
    createdAt: new Date().toLocaleString()
  };

  todos.push(newTodo);
  res.redirect('/');
});
 
app.get('/delete-todo/:id', (req, res) => {
  todos = todos.filter(todo => todo.id !== req.params.id);
  res.redirect('/');
});
 
app.get('/edit-todo/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === req.params.id);
  res.render('edit-todo', { todo });
});
 
app.post('/update-todo/:id', (req, res) => {
  todos = todos.map(todo =>
    todo.id === req.params.id
      ? {
          ...todo,
          title: req.body.title,
          description: req.body.description,
          date: req.body.date,
          time: req.body.time,
          priority: req.body.priority,
          status: req.body.status
        }
      : todo
  );

  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
