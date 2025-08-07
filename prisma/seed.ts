import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@techfixmobile.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  // Create services
  const services = [
    {
      name: 'Screen Replacement',
      description: 'Professional screen replacement for smartphones',
      price: 89.99,
      duration: 45,
      category: 'Screen'
    },
    {
      name: 'Battery Replacement',
      description: 'Replace old battery with genuine parts',
      price: 59.99,
      duration: 30,
      category: 'Battery'
    },
    {
      name: 'Water Damage Repair',
      description: 'Professional water damage repair and data recovery',
      price: 129.99,
      duration: 60,
      category: 'Water Damage'
    },
    {
      name: 'Software Fix',
      description: 'Software troubleshooting and system recovery',
      price: 49.99,
      duration: 30,
      category: 'Software'
    }
  ]

  for (const service of services) {
    await prisma.service.create({ data: service })
  }

  // Create business info
  await prisma.businessInfo.create({
    data: {
      name: 'TechFix Mobile',
      address: '123 Tech Street, Digital City, DC 12345',
      phone: '(555) 123-4567',
      email: 'info@techfixmobile.com',
      hours: {
        monday: { open: '09:00', close: '19:00' },
        tuesday: { open: '09:00', close: '19:00' },
        wednesday: { open: '09:00', close: '19:00' },
        thursday: { open: '09:00', close: '19:00' },
        friday: { open: '09:00', close: '19:00' },
        saturday: { open: '10:00', close: '17:00' },
        sunday: { open: '12:00', close: '16:00' }
      },
      socialLinks: {
        facebook: 'https://facebook.com/techfixmobile',
        instagram: 'https://instagram.com/techfixmobile',
        twitter: 'https://twitter.com/techfixmobile'
      }
    }
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
