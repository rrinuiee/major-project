const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('🟢 Smart Helmet Server running on ws://localhost:8080');

function randomHelmetData() {
  const states = ['ACTIVE', 'DROWSY', 'SLEEPING'];
  return {
    helmetId: 'H001',
    drowsiness: states[Math.floor(Math.random() * states.length)],
    impact: Math.random() < 0.1, // 10% chance
    gps: {
      lat: 10.015,
      lng: 76.341
    },
    ignitionAllowed: Math.random() > 0.3
  };
}

wss.on('connection', (ws) => {
  console.log('📱 App connected');

  setInterval(() => {
    const data = randomHelmetData();
    ws.send(JSON.stringify(data));
  }, 2000);
});
