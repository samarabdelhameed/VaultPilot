// backend/index.ts
import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// Route test
app.get("/", (req, res) => {
  res.send("VaultPilot backend is working ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
