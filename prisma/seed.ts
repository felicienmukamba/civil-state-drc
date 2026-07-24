import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const officerPassword = await bcrypt.hash('officier123', 10)

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: adminPassword,
      role: 'ADMIN',
      actif: true,
    },
  })

  await prisma.user.upsert({
    where: { username: 'officier' },
    update: {},
    create: {
      username: 'officier',
      password_hash: officerPassword,
      role: 'OFFICIER',
      actif: true,
    },
  })

  console.log('Seed executed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
