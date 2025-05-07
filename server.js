const WebSocket = require('ws');
const puppeteer = require('puppeteer');

const KEYWORD = '!bless'; // Customize this
const KICK_CHANNEL = 'https://kick.com/lilfin'; // Replace with your actual Kick channel name
const WEBSOCKET_PORT = 8080;

const entrants = new Set();
const clients = [];

const wss = new WebSocket.Server({ port: WEBSOCKET_PORT }, () =>
  console.log(`✅ WebSocket running on ws://localhost:${WEBSOCKET_PORT}`)
);

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.send(JSON.stringify({ type: 'entrants', names: [...entrants] }));
});

function broadcastEntrants() {
  const message = JSON.stringify({ type: 'entrants', names: [...entrants] });
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = `https://kick.com/${KICK_CHANNEL}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.exposeFunction('onChatMessage', ({ username, message }) => {
    if (message.toLowerCase().includes(KEYWORD.toLowerCase()) && !entrants.has(username)) {
      console.log(`✅ Added entrant: ${username}`);
      entrants.add(username);
      broadcastEntrants();
    }
  });

  await page.evaluate(() => {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.chat-message').forEach((el) => {
        const username = el.querySelector('.chat-user-username')?.innerText;
        const message = el.querySelector('.chat-message-text')?.innerText;
        if (username && message) {
          window.onChatMessage({ username, message });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });

  console.log(`👀 Listening to chat at ${url}`);
})();
