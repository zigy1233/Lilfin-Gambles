const entrantListElement = document.getElementById("entrantList");
let entrants = [];
let ws;
let wheelCanvas = document.getElementById("wheelCanvas");
let ctx = wheelCanvas.getContext("2d");
let spinning = false;

function startListening() {
  const keyword = document.getElementById("keyword").value.trim().toLowerCase();
  if (!keyword) {
    alert("Please enter a keyword.");
    return;
  }

  ws = new WebSocket("ws://localhost:8080");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "entrants") {
      entrants = data.names;
      updateEntrantList();
      drawWheel();
    }
  };

  ws.onerror = () => alert("WebSocket error. Make sure server.js is running.");
}

function updateEntrantList() {
  entrantListElement.innerHTML = "";
  entrants.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    entrantListElement.appendChild(li);
  });
}

function drawWheel() {
  const total = entrants.length;
  if (total === 0) return;

  const radius = wheelCanvas.width / 2;
  const angle = (2 * Math.PI) / total;

  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

  for (let i = 0; i < total; i++) {
    const start = i * angle;
    const end = start + angle;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.fillStyle = i % 2 === 0 ? "#00ff88" : "#008866";
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(entrants[i], radius - 10, 10);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning || entrants.length === 0) return;

  spinning = true;
  const total = entrants.length;
  const winnerIndex = Math.floor(Math.random() * total);
  const degreesPerSlice = 360 / total;
  const stopAngle = 360 * 5 + (winnerIndex * degreesPerSlice) + (degreesPerSlice / 2);

  let angle = 0;
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.save();
    ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
    drawWheel();
    ctx.restore();

    angle += 10;
    if (angle >= stopAngle) {
      clearInterval(interval);
      spinning = false;
      alert(`🎉 Winner: ${entrants[winnerIndex]}!`);
    }
  }, 30);
}
