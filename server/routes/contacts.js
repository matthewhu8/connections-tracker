const express = require('express');
const prisma = require('../utils/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all contacts for the user
router.get('/', async (req, res) => {
  try {
    const { firm, role, reachedOut, responded, search } = req.query;
    
    const where = {
      userId: req.userId
    };
    
    // Add filters
    if (firm) where.firm = firm;
    if (role) where.role = role;
    if (reachedOut !== undefined) where.reachedOut = reachedOut === 'true';
    if (responded !== undefined) where.responded = responded === 'true';
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { firm: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const contacts = await prisma.contact.findMany({
      where,
      include: {
        referredBy: {
          select: {
            id: true,
            fullName: true
          }
        },
        referredContacts: {
          select: {
            id: true,
            fullName: true
          }
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// Get single contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: {
        referredBy: true,
        referredContacts: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contact' });
  }
});

// Create contact
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      jobTitle,
      firm,
      role,
      email,
      phone,
      linkedIn,
      reachedOut,
      responded,
      referredById
    } = req.body;
    
    // Validate required fields
    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    
    // Check if referredById contact exists and belongs to user
    if (referredById) {
      const referrer = await prisma.contact.findFirst({
        where: {
          id: referredById,
          userId: req.userId
        }
      });
      
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referrer' });
      }
    }
    
    const contact = await prisma.contact.create({
      data: {
        userId: req.userId,
        fullName,
        jobTitle,
        firm,
        role,
        email,
        phone,
        linkedIn,
        reachedOut: reachedOut || false,
        responded: responded || false,
        referredById
      },
      include: {
        referredBy: true
      }
    });
    
    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating contact' });
  }
});

// Update contact
router.put('/:id', async (req, res) => {
  try {
    // Check if contact exists and belongs to user
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!existingContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const {
      fullName,
      jobTitle,
      firm,
      role,
      email,
      phone,
      linkedIn,
      reachedOut,
      responded,
      referredById
    } = req.body;
    
    // Check if referredById contact exists and belongs to user
    if (referredById && referredById !== existingContact.referredById) {
      const referrer = await prisma.contact.findFirst({
        where: {
          id: referredById,
          userId: req.userId
        }
      });
      
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referrer' });
      }
    }
    
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: {
        fullName,
        jobTitle,
        firm,
        role,
        email,
        phone,
        linkedIn,
        reachedOut,
        responded,
        referredById
      },
      include: {
        referredBy: true,
        referredContacts: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contact' });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    // Check if contact exists and belongs to user
    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await prisma.contact.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

module.exports = router;