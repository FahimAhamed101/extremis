/**
 * One-off maintenance script.
 *
 * The seeded reels pointed at
 *   https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/*.mp4
 * which now returns HTTP 403, so every reel rendered as a black screen.
 *
 * This repoints them at videos served by this backend (/uploads/...), which the
 * app resolves against whatever host it is currently talking to.
 *
 * Usage:  node scripts/fix-reel-videos.js [--dry-run]
 */
const loadEnv = require("../src/config/loadEnv");
loadEnv();

// Node's c-ares resolver cannot always resolve the Atlas SRV record on Windows
// even when the OS can, which makes connectDB() throw a SRV lookup error. When
// no explicit fallback is configured, derive the equivalent non-SRV seed list
// from MONGODB_URI so this script works the same way the running server does.
function ensureLocalUriFallback() {
  if (process.env.MONGODB_LOCAL_URI) return;
  const srv = process.env.MONGODB_URI || "";
  const match = srv.match(/^mongodb\+srv:\/\/([^@]+)@([^/]+)\/(.*)$/);
  if (!match) return;

  const credentials = match[1];
  const rest = match[3];
  const clusterHost = match[2].split(".")[0]; // cluster0.7khaz.mongodb.net
  const domain = match[2].split(".").slice(1).join("."); // 7khaz.mongodb.net
  // Atlas shard hostnames are <cluster>-shard-00-00/-01/-02, matching what the
  // SRV record itself publishes.
  const shards = ["00", "01", "02"]
    .map((n) => `${clusterHost}-shard-00-${n}.${domain}:27017`)
    .join(",");
  const dbName = rest.split("?")[0];

  process.env.MONGODB_LOCAL_URI =
    `mongodb://${credentials}@${shards}/${dbName}` +
    "?tls=true&authSource=admin&retryWrites=true&w=majority";
}

ensureLocalUriFallback();

const connectDB = require("../src/config/db");
const mongoose = require("mongoose");
const Reel = require("../src/models/Reel");

const LOCAL_VIDEOS = [
  "/uploads/story-guest-1789667453886.mp4",
  "/uploads/video-6aabd207d06ee7769f767d4b-1789646438788.mp4",
  "/uploads/video-6aabd207d06ee7769f767d4b-1789667155072.mp4",
];

// Hosts we know are dead (403 / retired sample buckets).
const DEAD_HOSTS = /commondatastorage\.googleapis\.com|gtv-videos-bucket/i;

const dryRun = process.argv.includes("--dry-run");

(async () => {
  try {
    await connectDB();

    const reels = await Reel.find({}).lean();
    console.log(`Total reels in DB: ${reels.length}`);
    for (const reel of reels) {
      const flag = DEAD_HOSTS.test(reel.videoUrl || "") ? "DEAD " : "ok   ";
      console.log(`  ${flag} ${reel._id}  ${reel.videoUrl}`);
    }

    let cursor = 0;
    let updated = 0;
    for (const reel of reels) {
      if (!DEAD_HOSTS.test(reel.videoUrl || "")) continue;
      const target = LOCAL_VIDEOS[cursor++ % LOCAL_VIDEOS.length];
      if (dryRun) {
        console.log(`DRY-RUN would set ${reel._id} -> ${target}`);
      } else {
        await Reel.updateOne({ _id: reel._id }, { $set: { videoUrl: target } });
        console.log(`UPDATED ${reel._id} -> ${target}`);
      }
      updated += 1;
    }

    console.log(`${dryRun ? "Would update" : "Updated"} ${updated} reel(s).`);
  } catch (error) {
    console.error("FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
