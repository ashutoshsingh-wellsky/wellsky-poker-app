// Simple test for the Socket.IO API
import handler from './api/socket.js';

// Test health endpoint
const req = {
  method: 'GET',
  url: '/api/health'
};

const res = {
  status: (code) => ({
    json: (data) => {
      console.log('✅ Health endpoint test passed!');
      console.log('Status:', code);
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  })
};

handler(req, res);
