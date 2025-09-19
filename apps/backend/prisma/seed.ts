import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
    },
  });
  
  // Don't create a company - let user go through onboarding
  // const existingCompany = await prisma.company.findFirst({
  //   where: { userId: user.id },
  // });

  // const company = existingCompany || await prisma.company.create({
  //   data: {
  //     userId: user.id,
  //     name: 'Demo Startup Inc.',
  //     sector: 'Technology',
  //     targetRaise: 5000000,
  //     revenue: 250000,
  //     kycVerified: false,
  //     financialsLinked: false,
  //   },
  // });
  
  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: 'welcome',
        message: 'Welcome to the Investor Readiness Platform!',
      },
      {
        userId: user.id,
        type: 'onboarding_started',
        message: 'Complete your company onboarding to get started.',
      },
    ],
  });
  
  console.log('Database seeded successfully!');
  console.log('Demo user:', user.email);
  console.log('No company created - user will go through onboarding');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });