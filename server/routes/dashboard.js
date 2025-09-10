const express = require('express');
const prisma = require('../utils/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats for user
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get total contacts count
    const totalContacts = await prisma.contact.count({
      where: { userId }
    });

    // Get reached out count
    const reachedOut = await prisma.contact.count({
      where: { 
        userId,
        reachedOut: true
      }
    });

    // Get responded count
    const responded = await prisma.contact.count({
      where: { 
        userId,
        responded: true
      }
    });

    // Calculate response rate
    const responseRate = reachedOut > 0 
      ? Math.round((responded / reachedOut) * 100 * 10) / 10
      : 0;

    // Get top firms
    const contacts = await prisma.contact.findMany({
      where: { userId },
      select: { firm: true }
    });

    const firmCounts = {};
    contacts.forEach(contact => {
      if (contact.firm) {
        firmCounts[contact.firm] = (firmCounts[contact.firm] || 0) + 1;
      }
    });

    const topFirms = Object.entries(firmCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get recent contacts
    const recentContacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        fullName: true,
        firm: true,
        role: true,
        jobTitle: true,
        reachedOut: true,
        responded: true,
        createdAt: true
      }
    });

    res.json({
      totalContacts,
      reachedOut,
      responded,
      responseRate,
      topFirms,
      recentContacts: recentContacts.map(contact => ({
        id: contact.id,
        name: contact.fullName,
        firm: contact.firm,
        role: contact.role || contact.jobTitle,
        reachedOut: contact.reachedOut,
        responded: contact.responded
      }))
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;