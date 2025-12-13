import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import authorRoutes from "./routes/authorRoutes";
import genreRoutes from "./routes/genreRoutes";
import bookRoutes from "./routes/bookRoutes";
import bookFilter from "./routes/bookFilterRoutes";
import assistantRoutes from "./routes/assistantRoutes"; 
import cors from "cors"
import OpenAI from "openai";
import testOpenAI from "./utils/testOpenAI";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());

const PORT = 5000;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/books/", bookRoutes);
app.use("/api/books/filter", bookFilter);
app.use("/api/assistant", assistantRoutes);

app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//   app.get("/test-ai", async (req, res) => {
//   try {
//     // Call the testOpenAI function
//     const output = await testOpenAI(); // we need to modify testOpenAI to return text
//     res.send({ message: output });
//   } catch (err) {
//     res.status(500).send({ error: "Failed to get AI response" });
//   }
// });