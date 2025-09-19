import { FastifyInstance } from 'fastify';
import { createCompanySchema, updateCompanySchema } from '../types/schemas';

export async function companyRoutes(fastify: FastifyInstance) {
  // Create or update company
  fastify.post('/company', async (request, reply) => {
    try {
      const body = createCompanySchema.parse(request.body);
      const email = (request.headers['x-user-email'] as string) || 'demo@example.com';
      
      // Find or create user
      let user = await fastify.prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        user = await fastify.prisma.user.create({
          data: { email },
        });
      }
      
      // Check if company already exists for this user
      let company = await fastify.prisma.company.findFirst({
        where: { userId: user.id },
        include: {
          documents: true,
        },
      });

      if (company) {
        // Update existing company
        company = await fastify.prisma.company.update({
          where: { id: company.id },
          data: body,
          include: {
            documents: true,
          },
        });
      } else {
        // Create new company
        company = await fastify.prisma.company.create({
          data: {
            ...body,
            userId: user.id,
          },
          include: {
            documents: true,
          },
        });
      }
      
      return reply.code(201).send({
        success: true,
        data: company,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({
        success: false,
        error: 'Invalid company data',
      });
    }
  });
  
  // Get company by user email
  fastify.get('/company', async (request, reply) => {
    try {
      const email = (request.headers['x-user-email'] as string) || 'demo@example.com';
      
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
          error: 'Company not found',
        });
      }
      
      return reply.send({
        success: true,
        data: user.companies[0],
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });
}