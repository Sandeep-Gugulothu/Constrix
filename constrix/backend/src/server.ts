import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './database/connection';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();