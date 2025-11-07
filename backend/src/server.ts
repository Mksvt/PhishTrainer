import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import emailRoutes from "./routes/email.routes";
import simulationRoutes from "./routes/simulation.routes";
import { connectRedis, disconnectRedis } from "./config/redis";

// Завантаження змінних середовища
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "PhishTrainer API Server",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            emails: "/api/emails",
            simulation: "/api/simulation",
        },
    });
});

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/simulation", simulationRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Маршрут не знайдено" });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Помилка сервера:", err);
    res.status(500).json({
        error: "Внутрішня помилка сервера",
        message:
            process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// Start server
const server = app.listen(PORT, async () => {
    console.log(`[SERVER] Сервер запущено на порту ${PORT}`);
    console.log(`[API] Доступний за адресою: http://localhost:${PORT}/api`);
    console.log(`[ENV] Середовище: ${process.env.NODE_ENV || "development"}`);

    // Підключення до Redis
    await connectRedis();
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("[SERVER] SIGTERM отримано, вимикаємо сервер...");
    server.close(async () => {
        console.log("[SERVER] HTTP сервер вимкнено");
        await disconnectRedis();
        process.exit(0);
    });
});

process.on("SIGINT", async () => {
    console.log("[SERVER] SIGINT отримано, вимикаємо сервер...");
    server.close(async () => {
        console.log("[SERVER] HTTP сервер вимкнено");
        await disconnectRedis();
        process.exit(0);
    });
});

export default app;
