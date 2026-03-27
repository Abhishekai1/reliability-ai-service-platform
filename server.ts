import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRoutes from "./src/server/api/routes";
import { config } from "./src/server/core/config";

async function startServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api", apiRoutes);

  // Vite middleware for development
  if (config.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(config.PORT, "0.0.0.0", () => {
    console.log(`RAASP Server running on http://localhost:${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
