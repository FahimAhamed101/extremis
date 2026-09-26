/**
 * Shared bootstrap for the one-off maintenance scripts in this folder.
 *
 * Node's c-ares resolver cannot always resolve the Atlas SRV record on Windows
 * even when the OS can (nslookup works, Node throws querySrv ECONNREFUSED),
 * which makes connectDB() fail. When no explicit MONGODB_LOCAL_URI is
 * configured, derive the equivalent non-SRV seed list from MONGODB_URI.
 */
const loadEnv = require("../../src/config/loadEnv");

function ensureLocalUriFallback() {
  if (process.env.MONGODB_LOCAL_URI) return;
  const srv = process.env.MONGODB_URI || "";
  const match = srv.match(/^mongodb\+srv:\/\/([^@]+)@([^/]+)\/(.*)$/);
  if (!match) return;

  const credentials = match[1];
  const rest = match[3];
  const clusterHost = match[2].split(".")[0]; // cluster0
  const domain = match[2].split(".").slice(1).join("."); // 7khaz.mongodb.net
  // Atlas shard hostnames are <cluster>-shard-00-00/-01/-02, matching the SRV record.
  const shards = ["00", "01", "02"]
    .map((n) => `${clusterHost}-shard-00-${n}.${domain}:27017`)
    .join(",");
  const dbName = rest.split("?")[0];

  process.env.MONGODB_LOCAL_URI =
    `mongodb://${credentials}@${shards}/${dbName}` +
    "?tls=true&authSource=admin&retryWrites=true&w=majority";
}

loadEnv();
ensureLocalUriFallback();

module.exports = {
  connectDB: require("../../src/config/db"),
  mongoose: require("mongoose"),
};
