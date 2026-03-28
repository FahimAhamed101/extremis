const mongoose = require("mongoose");

let connectionPromise = null;

function createConfigError(message) {
  const error = new Error(message);
  error.statusCode = 500;
  error.expose = true;
  return error;
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw createConfigError("MONGODB_URI is missing. Add it to your environment variables.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || undefined,
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
  return mongoose.connection;
}

module.exports = connectDB;
