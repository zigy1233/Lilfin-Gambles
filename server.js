const WebSocket = require('ws');
const http = require('http');
const Kick = require('kick-chat'); // <--- this is the magic!

let entrants = new Set();
let keyword = 'bless'; // match with the input on your website

// Create HTTP + WebSocket server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Frontend connected');
  ws.send(JSON.stringify({ type: 'entrants', names: Array.from(entrants) }));
});

// Connect to your Kick channel
const client = new Kick.ChatClient('LILFIN'); // your Kick username

client.on('message', (msg) => {
  const user = msg.sender.username;
  const message = msg.content;

  console.log(`${user}: ${message}`);

  if (message.toLowerCase().includes(keyword)) {
    entrants.add(user);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'entrants', names: Array.from(entrants) }));
      }
    });
  }
});

client.connect();
server.listen(8080, () => {
  console.log('✅ Server running at http://localhost:8080');
});
