const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    }
  });
  
  console.log('Created user:', user.email);
  
  // Create some test contacts
  const contact1 = await prisma.contact.create({
    data: {
      userId: user.id,
      fullName: 'Jane Doe',
      jobTitle: 'Analyst',
      firm: 'Goldman Sachs',
      role: 'M&A',
      email: 'jane.doe@gs.com',
      linkedIn: 'linkedin.com/in/janedoe',
      reachedOut: true,
      responded: true
    }
  });
  
  const contact2 = await prisma.contact.create({
    data: {
      userId: user.id,
      fullName: 'John Smith',
      jobTitle: 'Associate',
      firm: 'Morgan Stanley',
      role: 'IBD',
      email: 'john.smith@ms.com',
      reachedOut: true,
      responded: false,
      referredById: contact1.id
    }
  });
  
  const contact3 = await prisma.contact.create({
    data: {
      userId: user.id,
      fullName: 'Sarah Johnson',
      jobTitle: 'VP',
      firm: 'JP Morgan',
      role: 'LevFin',
      email: 'sarah.j@jpmorgan.com',
      phone: '555-0123',
      reachedOut: false,
      responded: false
    }
  });
  
  // Create some notes
  await prisma.note.create({
    data: {
      userId: user.id,
      contactId: contact1.id,
      content: 'Had coffee chat on 9/3. Very helpful! Referred me to John Smith in MS IBD.'
    }
  });
  
  await prisma.note.create({
    data: {
      userId: user.id,
      contactId: contact1.id,
      content: 'Follow up: Sent thank you note. She offered to review my resume.'
    }
  });
  
  await prisma.note.create({
    data: {
      userId: user.id,
      contactId: contact2.id,
      content: 'Reached out via email. Waiting for response.'
    }
  });
  
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });