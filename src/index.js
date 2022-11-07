const app = require("./app");

const port = process.env.PORT || 5000;
const startServer = async () => {
  app.listen(port, async () => {
    try {
      console.log("\x1b[35m", `Server is running on port ${port}`);
    } catch (error) {
      console.log("\x1b[31m", `Error connecting to database: ${error}`);
    }
  });
  console.log("\x1b[33m", "Connecting to database...");
  await console.log("\x1b[33m", "Connected to database");
};
startServer();
