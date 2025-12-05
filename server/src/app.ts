import express from 'express';

const app = express();
const PORT = 5000; 

app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Node.js server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});