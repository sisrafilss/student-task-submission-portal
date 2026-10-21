import prisma from '../shared/prisma';

async function main() {
  console.log('🌱 Starting database seed for Student Submission Portal...');

  // Upsert Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@portal.test' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@portal.test',
      role: 'ADMIN',
    },
  });
  console.log('👤 Created Admin user:', admin);

  // Upsert Student
  const student = await prisma.user.upsert({
    where: { email: 'student@portal.test' },
    update: {},
    create: {
      name: 'Rahim Ahmed',
      email: 'student@portal.test',
      role: 'STUDENT',
    },
  });
  console.log('🎓 Created Student user:', student);

  const totalUsers = await prisma.user.count();
  console.log(`✅ Seed completed successfully! Total users in database: ${totalUsers}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

