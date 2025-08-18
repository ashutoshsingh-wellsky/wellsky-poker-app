const http = require('http');
const handler = require('./api/socket.js').default;

const server = http.createServer();

server.on('request', (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  handler(req, res);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log('🏥 Health check: http://localhost:3001/api/health');
  console.log('📊 Sessions: http://localhost:3001/api/sessions');
});
