import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import User from '../models/User';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { walletAddress, signature, message } = req.body;

      if (!walletAddress || !signature || !message) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          message: 'walletAddress, signature, and message are required' 
        });
      }

      // Verify signature
      try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(401).json({ 
            error: 'Invalid signature',
            message: 'Signature verification failed' 
          });
        }
      } catch (error) {
        return res.status(401).json({ 
          error: 'Invalid signature',
          message: 'Failed to verify signature' 
        });
      }

      // Find or create user
      let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      if (!user) {
        user = new User({ walletAddress: walletAddress.toLowerCase() });
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, walletAddress: user.walletAddress },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({ 
        token, 
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || user.createdAt
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to authenticate user' 
      });
    }
  }

  static async logout(req: Request, res: Response) {
    res.json({ success: true });
  }

  static async me(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          message: 'User account not found' 
        });
      }

      res.json({ 
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || user.createdAt
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to get user information' 
      });
    }
  }
}