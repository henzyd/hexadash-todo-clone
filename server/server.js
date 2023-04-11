const dotenv = require("dotenv");

dotenv.config();

// require("./db/db");

const app = require("./app");

const port = process.env.LOCAL_PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port} ==> http://localhost:${port}`);
});
