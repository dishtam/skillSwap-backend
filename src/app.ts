import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes setup
app.use("/api/user/", userRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
