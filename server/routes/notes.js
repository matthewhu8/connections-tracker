const express = require('express');
const prisma = require('../utils/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get notes for a contact
router.get('/contact/:contactId', async (req, res) => {
  try {
    // Verify contact belongs to user
    const contact = await prisma.contact.findFirst({
      where: {
        id: req.params.contactId,
        userId: req.userId
      }
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const notes = await prisma.note.findMany({
      where: {
        contactId: req.params.contactId,
        userId: req.userId
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Create note
router.post('/', async (req, res) => {
  try {
    const { contactId, content } = req.body;
    
    if (!contactId || !content) {
      return res.status(400).json({ message: 'Contact ID and content are required' });
    }
    
    // Verify contact belongs to user
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId: req.userId
      }
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const note = await prisma.note.create({
      data: {
        userId: req.userId,
        contactId,
        content
      }
    });
    
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { content }
    });
    
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    // Check if note exists and belongs to user
    const note = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    await prisma.note.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;