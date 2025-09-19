import { FastifyInstance } from "fastify";
import { linkFinancialsSchema } from "../types/schemas";

export async function financialsRoutes(fastify: FastifyInstance) {
  // Link financials
  fastify.post("/financials/link", async (request, reply) => {
    try {
      const body = linkFinancialsSchema.parse(request.body);
      const email =
        (request.headers["x-user-email"] as string) || "demo@example.com";

      // Find user
      const user = await fastify.prisma.user.findUnique({
        where: { email },
        include: {
          companies: true,
        },
      });

      if (!user || !user.companies.length) {
        return reply.code(404).send({
          success: false,
          error: "Company not found",
        });
      }

      // Update company financials status
      const company = await fastify.prisma.company.update({
        where: { id: user.companies[0].id },
        data: { financialsLinked: true },
      });

      // Create notification
      await fastify.prisma.notification.create({
        data: {
          userId: user.id,
          type: "financials_linked",
          message: "Financial data linked successfully",
        },
      });

      return reply.send({
        success: true,
        data: { financials_linked: true },
        company,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({
        success: false,
        error: "Invalid financials data",
      });
    }
  });
}
