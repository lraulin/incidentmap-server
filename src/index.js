const express = require("express");
const { tweetStreamer } = require("./tweetStreamer.js");

// Port for server to use
const PORT = 3050;

// Initialize database connection
const { postgres } = require("./postgres.js");

// Initialize server
const app = express();

// Begin watching for tweets to add to database.
tweetStreamer(postgres);

// Begin listening for connections
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Make database contents available via REST api
app.get("/tweets", async (req, res, next) => {
  const data = await postgres.fetch();
  res.json(data);
});
