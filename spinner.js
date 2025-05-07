const entrants = [];

function drawWheel() {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const arcSize = (2 * Math.PI) / entrants.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  entrants.forEach((name, i) => {
    const angle = i * arcSize;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 200, angle, angle + arcSize);
    ctx.fillStyle = `hsl(${i * (360 / entrants.length)}, 100%, 50%)`;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fillText(name, 250 + Math.cos(angle + arcSize / 2) * 100, 250 + Math.sin(angle + arcSize / 2) * 100);
  });
}

function spinWheel() {
  if (entrants.length === 0) return alert("No entrants yet!");
  const winner = entrants[Math.floor(Math.random() * entrants.length)];
  alert(`🎉 The winner is: ${winner}!`);
}

function updateEntrants() {
  const list = document.getElementById("entrantList");
  list.innerHTML = entrants.map(name => `<li>${name}</li>`).join("");
  drawWheel();
}
