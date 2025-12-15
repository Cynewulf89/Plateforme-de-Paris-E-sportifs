const express = require('express');
const cors = require('cors');

console.log('Starting simple server...');

const app = express();
const PORT = 3003;

console.log('Setting up middleware...');

app.use(cors());
app.use(express.json());

console.log('Setting up routes...');

app.get('/api/test', (req, res) => {
  console.log('Received request to /api/test');
  res.json({ message: 'Server is working!' });
});

console.log('Setting up error handlers...');

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('About to start listening on port', PORT);

app.listen(PORT, 'localhost', () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log('Server started successfully');

  // Keep server alive
  setInterval(() => {
    console.log('Simple server is still running...');
  }, 2000);
});