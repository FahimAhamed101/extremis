/**
 * Read-only audit of the Reels collection.
 *
 * The reels screen was opening on a black, unplayable card because a reel
 * existed whose videoUrl was the literal string "null" (written by an early
 * test of the create-reel flow). safeString() coerces that to "" in the app,
 * so no player is ever built and the page renders as an empty black rectangle.
 *
 * This script only REPORTS. Pass --delete to remove the broken records.
 */
const { connectDB, mongoose } = require("./lib/mongo");
const Reel = require("../src/models/Reel");

const DELETE = process.argv.includes("--delete");

/** A reel is broken if it has no usable video URL. */
function isBroken(videoUrl) {
  if (videoUrl === null || videoUrl === undefined) return true;
  const value = String(videoUrl).trim();
  return value === "" || value.toLowerCase() === "null" || value.toLowerCase() === "undefined";
}

(async () => {
  await connectDB();

  const all = await Reel.find({}).sort({ createdAt: -1 }).lean();
  const broken = all.filter((r) => isBroken(r.videoUrl));

  console.log(`Reels total   : ${all.length}`);
  console.log(`Playable      : ${all.length - broken.length}`);
  console.log(`Broken (no video): ${broken.length}`);

  for (const r of broken) {
    console.log(
      `  - ${r._id}  videoUrl=${JSON.stringify(r.videoUrl)}  caption=${JSON.stringify(
        r.caption
      )}  author=${r.author}  createdAt=${r.createdAt && r.createdAt.toISOString()}`
    );
  }

  if (!broken.length) {
    console.log("\nNothing to clean.");
  } else if (DELETE) {
    const ids = broken.map((r) => r._id);
    const res = await Reel.deleteMany({ _id: { $in: ids } });
    console.log(`\nDeleted ${res.deletedCount} broken reel(s).`);
  } else {
    console.log("\nDry run. Re-run with --delete to remove them.");
  }

  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
