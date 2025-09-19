import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️  Resetting database...");

  // Delete all data in the correct order (respecting foreign key constraints)
  await prisma.message.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database cleared successfully");
}

async function resetUploads() {
  console.log("🗑️  Clearing uploads directory...");

  const uploadsDir = path.join(__dirname, "..", "uploads");

  try {
    // Check if uploads directory exists
    await fs.access(uploadsDir);

    // Read all files in uploads directory
    const files = await fs.readdir(uploadsDir);

    // Delete each file
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stat = await fs.stat(filePath);

      if (stat.isFile()) {
        await fs.unlink(filePath);
        console.log(`  Deleted: ${file}`);
      }
    }

    console.log("✅ Uploads directory cleared successfully");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("ℹ️  Uploads directory does not exist, skipping...");
    } else {
      console.error("❌ Error clearing uploads directory:", error);
    }
  }
}

async function reseedDatabase() {
  console.log("🌱 Reseeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
    },
  });

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: "welcome",
        message: "Welcome to the Investor Readiness Platform!",
      },
      {
        userId: user.id,
        type: "onboarding_started",
        message: "Complete your company onboarding to get started.",
      },
    ],
  });

  console.log("✅ Database reseeded successfully");
  console.log(`👤 Demo user: ${user.email}`);
}

async function main() {
  console.log("🚀 Starting reset process...\n");

  try {
    await resetDatabase();
    await resetUploads();
    await reseedDatabase();

    console.log("\n🎉 Reset completed successfully!");
    console.log("📝 You can now run: npm run dev");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
