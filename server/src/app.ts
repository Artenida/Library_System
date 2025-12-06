import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import authorRoutes from "./routes/authorRoutes"
import genreRoutes from './routes/genreRoutes'

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 5000; 

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/author", authorRoutes)
app.use("/api/genre", genreRoutes)

app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Node.js server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});