const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const prisma = require('../utils/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  console.log('=== Google Auth Endpoint Hit ===');
  console.log('Request body:', req.body);
  console.log('Google Client ID from env:', process.env.GOOGLE_CLIENT_ID);
  
  try {
    const { credential } = req.body;
    
    if (!credential) {
      console.error('No credential provided in request');
      return res.status(400).json({
        success: false,
        message: 'No credential provided',
      });
    }

    console.log('Credential received, length:', credential.length);
    console.log('Attempting to verify with Google...');

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log('Google verification successful');
    const payload = ticket.getPayload();
    console.log('User payload:', {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
    });
    
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    console.log('Looking for existing user with googleId:', googleId);
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      console.log('No user found with googleId, checking email:', email);
      // Check if user exists with email
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        console.log('User found with email, updating with Google info');
        // Update existing user with Google ID
        user = await prisma.user.update({
          where: { email },
          data: { googleId, name, picture },
        });
      } else {
        console.log('Creating new user');
        // Create new user
        user = await prisma.user.create({
          data: {
            googleId,
            email,
            name,
            picture,
          },
        });
        console.log('New user created:', user.id);
      }
    } else {
      console.log('Existing user found, updating info');
      // Update user info
      user = await prisma.user.update({
        where: { googleId },
        data: { name, picture },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('JWT token generated successfully');
    console.log('Sending successful response');

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('=== Google Auth Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.message?.includes('Wrong number of segments in token')) {
      console.error('Invalid token format');
      return res.status(400).json({
        success: false,
        message: 'Invalid token format',
      });
    }
    
    if (error.message?.includes('Token used too late')) {
      console.error('Token expired');
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }
    
    res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed',
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

module.exports = router;