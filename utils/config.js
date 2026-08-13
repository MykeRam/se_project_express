require("dotenv").config({ quiet: true });

const {
  NODE_ENV,
  JWT_SECRET,
  PORT = 3001,
  MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db",
} = process.env;

if (NODE_ENV === "production" && !JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

module.exports = {
  JWT_SECRET: JWT_SECRET || "dev-secret",
  PORT,
  MONGO_URL,
};
