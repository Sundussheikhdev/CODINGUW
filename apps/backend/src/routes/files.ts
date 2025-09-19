import { FastifyInstance } from "fastify";
import { promises as fs } from "fs";
import path from "path";
import { fileUploadSchema } from "../types/schemas";

export async function filesRoutes(fastify: FastifyInstance) {
  // Upload file
  fastify.post("/files", async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({
          success: false,
          error: "No file uploaded",
        });
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      ];

      if (!allowedTypes.includes(data.mimetype)) {
        return reply.code(400).send({
          success: false,
          error:
            "Invalid file type. Only PDF, PPTX, and XLSX files are allowed.",
        });
      }

      const email =
        (request.headers["x-user-email"] as string) || "demo@example.com";

      // Find user and company
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

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const fileExtension = path.extname(data.filename);
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Save file
      await fs.writeFile(filePath, await data.toBuffer());

      // Save file record to database
      const document = await fastify.prisma.document.create({
        data: {
          companyId: user.companies[0].id,
          name: data.filename,
          mimeType: data.mimetype,
          size: data.file.bytesRead,
          path: filePath,
        },
      });

      // Create notification
      await fastify.prisma.notification.create({
        data: {
          userId: user.id,
          type: "file_uploaded",
          message: `File "${data.filename}" uploaded successfully`,
        },
      });

      return reply.code(201).send({
        success: true,
        data: document,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: "File upload failed",
      });
    }
  });

  // Get files for company
  fastify.get("/files", async (request, reply) => {
    try {
      const email =
        (request.headers["x-user-email"] as string) || "demo@example.com";

      // Find user and company
      const user = await fastify.prisma.user.findUnique({
        where: { email },
        include: {
          companies: {
            include: {
              documents: true,
            },
          },
        },
      });

      if (!user || !user.companies.length) {
        return reply.code(404).send({
          success: false,
          error: "Company not found",
        });
      }

      return reply.send({
        success: true,
        data: user.companies[0].documents,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: "Failed to fetch files",
      });
    }
  });
}
