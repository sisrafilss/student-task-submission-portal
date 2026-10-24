import prisma from '../shared/prisma';
import { hashPassword } from '../helpers/passwordHelpers';

async function main() {
  console.log('🌱 Starting database seed for Student Submission Portal...');

  const defaultHashedPassword = await hashPassword('123456');

  // 1. Seed Super Admin (admin@gmail.com / 123456)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      password: defaultHashedPassword,
      role: 'ADMIN',
      needsPasswordChange: false,
    },
    create: {
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: defaultHashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      needsPasswordChange: false,
    },
  });
  console.log('👤 Seeded Admin user:', admin.email);

  // 2. Seed Demo Mentor (mentor@gmail.com / 123456)
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@gmail.com' },
    update: {
      password: defaultHashedPassword,
      role: 'MENTOR',
      needsPasswordChange: false,
    },
    create: {
      name: 'Tanvir Hossain (Mentor)',
      email: 'mentor@gmail.com',
      password: defaultHashedPassword,
      role: 'MENTOR',
      status: 'ACTIVE',
      expertise: 'Full-Stack Web Development',
      needsPasswordChange: false,
    },
  });
  console.log('👨‍🏫 Seeded Demo Mentor user:', mentor.email);

  // 3. Seed Demo Student (student@gmail.com / 123456)
  const student = await prisma.user.upsert({
    where: { email: 'student@gmail.com' },
    update: {
      password: defaultHashedPassword,
      role: 'STUDENT',
      assignedBatchId: 'BATCH-01',
      needsPasswordChange: false,
    },
    create: {
      name: 'Rahim Ahmed (Student)',
      email: 'student@gmail.com',
      password: defaultHashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      assignedBatchId: 'BATCH-01',
      needsPasswordChange: false,
    },
  });
  console.log('🎓 Seeded Demo Student user:', student.email);

  // 4. Seed First-Time Unactivated Mentor (newmentor@gmail.com / 123456 - needs password change)
  const unactivatedMentor = await prisma.user.upsert({
    where: { email: 'newmentor@gmail.com' },
    update: {
      password: defaultHashedPassword,
      role: 'MENTOR',
      needsPasswordChange: true,
    },
    create: {
      name: 'Rasel Mahmud (New Mentor)',
      email: 'newmentor@gmail.com',
      password: defaultHashedPassword,
      role: 'MENTOR',
      status: 'ACTIVE',
      expertise: 'Frontend React Architecture',
      needsPasswordChange: true,
    },
  });
  console.log('⏳ Seeded First-Time Unactivated Mentor (needsPasswordChange: true):', unactivatedMentor.email);

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
