import { FastifyInstance } from 'fastify';

export async function notificationsRoutes(fastify: FastifyInstance) {
  // Get notifications for user
  fastify.get('/notifications', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  type: { type: 'string' },
                  message: { type: 'string' },
                  createdAt: { type: 'string' },
                  readAt: { type: ['string', 'null'] }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const email = (request.headers['x-user-email'] as string) || 'demo@example.com';
      
      // Find user
      const user = await fastify.prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }
      
      // Get notifications
      const notifications = await fastify.prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit to last 50 notifications
      });
      
      return reply.send({
        success: true,
        data: notifications,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch notifications',
      });
    }
  });
  
  // Mark notification as read
  fastify.patch('/notifications/:id/read', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', minLength: 1 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const email = (request.headers['x-user-email'] as string) || 'demo@example.com';
      
      // Find user
      const user = await fastify.prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }
      
      // Update notification
      const notification = await fastify.prisma.notification.updateMany({
        where: {
          id,
          userId: user.id,
        },
        data: {
          readAt: new Date(),
        },
      });
      
      if (notification.count === 0) {
        return reply.code(404).send({
          success: false,
          error: 'Notification not found',
        });
      }
      
      return reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to update notification',
      });
    }
  });
  
  // Mark all notifications as read
  fastify.patch('/notifications/read-all', {
    schema: {
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    try {
      const email = (request.headers['x-user-email'] as string) || 'demo@example.com';
      
      // Find user
      const user = await fastify.prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }
      
      // Update all unread notifications
      await fastify.prisma.notification.updateMany({
        where: {
          userId: user.id,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
      
      return reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to update notifications',
      });
    }
  });
}