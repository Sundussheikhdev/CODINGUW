import { FastifyInstance } from 'fastify';
import { kycVerifySchema } from '../types/schemas';

export async function kycRoutes(fastify: FastifyInstance) {
  // Verify KYC
  fastify.post('/kyc/verify', async (request, reply) => {
    try {
      const body = kycVerifySchema.parse(request.body);
      
      // Find user
      const user = await fastify.prisma.user.findUnique({
        where: { email: body.email },
        include: {
          companies: true,
        },
      });
      
      if (!user || !user.companies.length) {
        return reply.code(404).send({
          success: false,
          error: 'Company not found',
        });
      }
      
      // Update company KYC status
      const company = await fastify.prisma.company.update({
        where: { id: user.companies[0].id },
        data: { kycVerified: true },
      });
      
      // Create notification
      await fastify.prisma.notification.create({
        data: {
          userId: user.id,
          type: 'kyc_verified',
          message: 'KYC verification completed successfully',
        },
      });
      
      return reply.send({
        success: true,
        data: { verified: true },
        company,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({
        success: false,
        error: 'Invalid KYC data',
      });
    }
  });
}