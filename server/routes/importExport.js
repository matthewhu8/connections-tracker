const express = require('express');
const prisma = require('../utils/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Export contacts as JSON (CSV will be generated on frontend)
router.get('/export', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.userId },
      include: {
        referredBy: {
          select: {
            fullName: true
          }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    // Format for CSV export
    const exportData = contacts.map(contact => ({
      fullName: contact.fullName,
      jobTitle: contact.jobTitle || '',
      firm: contact.firm || '',
      role: contact.role || '',
      email: contact.email || '',
      phone: contact.phone || '',
      linkedIn: contact.linkedIn || '',
      reachedOut: contact.reachedOut ? 'Yes' : 'No',
      responded: contact.responded ? 'Yes' : 'No',
      referredBy: contact.referredBy?.fullName || '',
      notes: contact.notes.map(note => note.content).join(' | '),
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString()
    }));
    
    res.json(exportData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error exporting contacts' });
  }
});

// Import contacts from JSON (parsed from CSV on frontend)
router.post('/import', async (req, res) => {
  try {
    const { contacts } = req.body;
    
    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ message: 'Invalid import data' });
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    for (const contactData of contacts) {
      try {
        // Basic validation
        if (!contactData.fullName) {
          results.failed++;
          results.errors.push(`Missing full name for contact`);
          continue;
        }
        
        // Check for duplicate
        const existing = await prisma.contact.findFirst({
          where: {
            userId: req.userId,
            fullName: contactData.fullName,
            firm: contactData.firm || null
          }
        });
        
        if (existing) {
          results.failed++;
          results.errors.push(`Duplicate contact: ${contactData.fullName}`);
          continue;
        }
        
        // Create contact
        await prisma.contact.create({
          data: {
            userId: req.userId,
            fullName: contactData.fullName,
            jobTitle: contactData.jobTitle || null,
            firm: contactData.firm || null,
            role: contactData.role || null,
            email: contactData.email || null,
            phone: contactData.phone || null,
            linkedIn: contactData.linkedIn || null,
            reachedOut: contactData.reachedOut === 'Yes' || contactData.reachedOut === true,
            responded: contactData.responded === 'Yes' || contactData.responded === true
          }
        });
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Error importing ${contactData.fullName}: ${error.message}`);
      }
    }
    
    res.json({
      message: `Import completed: ${results.success} succeeded, ${results.failed} failed`,
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error importing contacts' });
  }
});

module.exports = router;