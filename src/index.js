require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT;

async function start() {
  await connectDB();
  const server = http.createServer(app);

  server.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start", err);
  process.exit(1);
});
