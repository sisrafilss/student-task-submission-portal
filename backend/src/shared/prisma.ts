import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import config from '../config';

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: config.database_url,
  });
  return new PrismaClient({ adapter });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (config.env !== 'production') {
  globalThis.prismaGlobal = prisma;
}

