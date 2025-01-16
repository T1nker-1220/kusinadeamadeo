import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create or update admin user
  await prisma.user.upsert({
    where: { email: 'kusinadeamadeo@gmail.com' },
    update: { role: 'ADMIN' },
    create: {
      id: 'd1e57514-df12-4104-b376-2b044c5cf7b0', // Your admin user's ID
      email: 'kusinadeamadeo@gmail.com',
      fullName: 'Kusina De Amadeo',
      phoneNumber: '',
      address: '',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
