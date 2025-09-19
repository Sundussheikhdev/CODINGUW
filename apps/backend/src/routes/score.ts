import { FastifyInstance } from 'fastify';

export async function scoreRoutes(fastify: FastifyInstance) {
  // Get investability score
  fastify.get('/score', async (request, reply) => {
    try {
      const email = (request.headers['x-user-email'] as string) || 'demo@example.com';
      
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
          error: 'Company not found',
        });
      }
      
      const company = user.companies[0];
      
      // Calculate score
      let score = 0;
      const reasons: string[] = [];
      
      // KYC verification: +30 points
      if (company.kycVerified) {
        score += 30;
        reasons.push('KYC verification completed');
      } else {
        reasons.push('Complete KYC verification to gain 30 points');
      }
      
      // Financials linked: +20 points
      if (company.financialsLinked) {
        score += 20;
        reasons.push('Financial data linked');
      } else {
        reasons.push('Link financial data to gain 20 points');
      }
      
      // Documents uploaded: +25 points (if at least 3 docs)
      if (company.documents.length >= 3) {
        score += 25;
        reasons.push(`Documentation complete (${company.documents.length} files)`);
      } else {
        reasons.push(`Upload more documents to gain 25 points (currently ${company.documents.length}/3)`);
      }
      
      // Revenue scaling: +25 points (0-$1M scaled to 0-25)
      const revenueScore = Math.min(25, (company.revenue / 1000000) * 25);
      score += revenueScore;
      if (revenueScore > 0) {
        reasons.push(`Revenue contribution: ${revenueScore.toFixed(1)} points`);
      } else {
        reasons.push('Increase revenue to gain up to 25 points');
      }
      
      // Generate recommendation
      let recommendation = '';
      if (score >= 80) {
        recommendation = 'Excellent! Your company is highly investable.';
      } else if (score >= 60) {
        recommendation = 'Good progress! Focus on the remaining areas to improve your score.';
      } else if (score >= 40) {
        recommendation = 'Getting there! Complete more requirements to boost your investability.';
      } else {
        recommendation = 'Early stage. Complete the onboarding steps to improve your score.';
      }
      
      return reply.send({
        success: true,
        data: {
          score: Math.round(score),
          reasons,
          recommendation,
          breakdown: {
            kyc: company.kycVerified ? 30 : 0,
            financials: company.financialsLinked ? 20 : 0,
            documents: company.documents.length >= 3 ? 25 : 0,
            revenue: Math.round(revenueScore),
          },
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to calculate score',
      });
    }
  });
}