import "dotenv/config";
import { prisma } from "./config/prisma.js";

async function testDatabase() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW() AS current_time`;

    console.log("PostgreSQL connected successfully!");
    console.log("Database time:", result[0].current_time);

    const usersCount = await prisma.user.count();
    console.log("Total users:", usersCount);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();