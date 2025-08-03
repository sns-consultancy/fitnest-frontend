const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Catch‑all to send index.html for unmatched routes (for client‑side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Front‑end server running at http://localhost:${PORT}`);
});