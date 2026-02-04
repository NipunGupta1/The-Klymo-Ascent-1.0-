// server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const config = require('./src/config/config');
const { connectMongoDB, connectRedis, disconnectMongoDB, disconnectRedis } = require('./src/config/database');
const { initializeSocketIO } = require('./src/websocket/socketHandler');

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: config.cors,
  path: '/socket.io'
});

// Initialize Socket.IO handlers
initializeSocketIO(io);

// Start server
async function startServer() {
  try {
    console.log('🚀 Anonymous Chat API starting up...');
    console.log(`📍 Frontend URL: ${config.cors.origin}`);

    // Connect to databases
    await connectMongoDB();
    connectRedis();

    // Start listening
    server.listen(config.port, config.host, () => {
      console.log('✅ All systems ready!');
      console.log(`🌐 Server running on http://${config.host}:${config.port}`);
      console.log(`🔌 Socket.IO ready on ws://${config.host}:${config.port}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  
  server.close(async () => {
    await disconnectMongoDB();
    await disconnectRedis();
    console.log('✅ Shutdown complete');
    process.exit(0);
  });
});

// Start the server
startServer();