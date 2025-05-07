function startListening() {
  const keyword = document.getElementById("keyword").value;
  if (!keyword) return alert("Set a keyword first!");

  alert(`(Stub) Listening for messages with keyword "${keyword}"...`);

  // Simulated chat API listener
  /*
  kick.onMessage((user, message) => {
    if (message.includes(keyword) && !entrants.includes(user)) {
      entrants.push(user);
      updateEntrants();
    }
  });
  */
}
