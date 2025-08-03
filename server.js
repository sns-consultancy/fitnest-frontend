const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files out of the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route: always serve index.html for unknown routes.  This
// enables client‑side routing if you choose to add it later.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Front‑end server is running on http://localhost:${PORT}`);
});