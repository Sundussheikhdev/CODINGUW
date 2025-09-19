import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import { PrismaClient } from "@prisma/client";
import { companyRoutes } from "./routes/company";
import { kycRoutes } from "./routes/kyc";
import { financialsRoutes } from "./routes/financials";
import { filesRoutes } from "./routes/files";
import { scoreRoutes } from "./routes/score";
import { notificationsRoutes } from "./routes/notifications";

const prisma = new PrismaClient();

const fastify = Fastify({
  logger: true,
});

// Register plugins
fastify.register(helmet);

// Add CORS manually
fastify.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-email');
  reply.header('Access-Control-Allow-Credentials', 'true');
});

// Handle preflight requests
fastify.addHook('onRequest', async (request, reply) => {
  if (request.method === 'OPTIONS') {
    reply.code(204).send();
  }
});
fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
fastify.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// Add Prisma to request context
fastify.decorate("prisma", prisma);

// Register routes
fastify.register(companyRoutes, { prefix: "/api" });
fastify.register(kycRoutes, { prefix: "/api" });
fastify.register(financialsRoutes, { prefix: "/api" });
fastify.register(filesRoutes, { prefix: "/api" });
fastify.register(scoreRoutes, { prefix: "/api" });
fastify.register(notificationsRoutes, { prefix: "/api" });

// Health check
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Graceful shutdown
const gracefulShutdown = async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port: Number(port), host: "0.0.0.0" });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Extend FastifyInstance to include Prisma
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
