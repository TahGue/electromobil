const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user with the specified email
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@electromobil.se' },
    update: {},
    create: {
      email: 'admin@electromobil.se',
      name: 'Electromobil Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create business info for Electromobil based on Hitta.se data
  await prisma.businessInfo.upsert({
    where: { id: 'business-1' },
    update: {},
    create: {
      id: 'business-1',
      name: 'Electromobil',
      address: 'Redbergsvägen 17, 416 65 Göteborg',
      phone: '031-21 91 06',
      email: 'info@electromobil.se',
      hours: JSON.stringify({
        monday: '09:00-18:00',
        tuesday: '09:00-18:00',
        wednesday: '09:00-18:00',
        thursday: '09:00-18:00',
        friday: '09:00-18:00',
        saturday: '10:00-16:00',
        sunday: 'Closed'
      }),
      socialLinks: JSON.stringify({
        website: 'https://electromobil.se',
        facebook: '',
        instagram: '',
        linkedin: ''
      })
    },
  });

  const services = [
    { name: 'Screen Replacement', description: 'Cracked or malfunctioning screen replacement for all major phone brands.', price: 120.0, duration: 60, category: 'Hardware' },
    { name: 'Battery Replacement', description: 'Fast and reliable battery replacement to bring your phone back to life.', price: 80.0, duration: 45, category: 'Hardware' },
    { name: 'Charging Port Repair', description: 'Repair of faulty charging ports to ensure your device powers up correctly.', price: 70.0, duration: 90, category: 'Hardware' },
    { name: 'Water Damage Repair', description: 'Comprehensive cleaning and repair for water-damaged devices.', price: 200.0, duration: 180, category: 'Repair' },
    { name: 'Software Troubleshooting', description: 'Resolving software issues, including OS errors, app crashes, and performance tuning.', price: 50.0, duration: 60, category: 'Software' },
  ];

  await prisma.service.createMany({
    data: services,
    skipDuplicates: true,
  });

  console.log('Database seeded successfully');
  console.log('Admin user created: admin@electromobil.se / admin123');
  console.log('Business info created for Electromobil');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
