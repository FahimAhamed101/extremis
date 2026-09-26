/**
 * Seeds the reels feed with real, locally hosted videos that cover every shape
 * the player has to handle:
 *
 *   portrait  (720x1280) -> fills the screen, TikTok style
 *   square    (720x720)  -> shown whole at post size
 *   landscape (640x360)  -> shown whole at post size, letterboxed
 *   landscape (848x478)  -> an actual user upload
 *
 * Videos live in backend/uploads and are served by this backend, so playback
 * never depends on a third-party CDN (the old sample bucket now returns 403).
 *
 * Usage: node scripts/seed-reels.js [--dry-run]
 */
const { connectDB, mongoose } = require("./lib/mongo");
const Reel = require("../src/models/Reel");
const User = require("../src/models/User");

const SEEDS = [
  {
    videoUrl: "/uploads/reel-portrait-1080x1920.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel-portrait/720/1280",
    caption: "Vertical reel — fills the screen 🎬 #portrait #fyp",
    views: 1240,
  },
  {
    videoUrl: "/uploads/reel-square-1080x1080.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel-square/720/720",
    caption: "Square clip — shown at post size ▫️ #square #reels",
    views: 812,
  },
  {
    videoUrl: "/uploads/reel-landscape-640x360.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel-landscape/640/360",
    caption: "Widescreen clip — shown whole, nothing cropped 🖥️ #landscape",
    views: 507,
  },
  {
    videoUrl: "/uploads/story-guest-1789667453886.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel-wide/848/478",
    caption: "Another widescreen upload — letterboxed, full frame visible 🎥 #video",
    views: 233,
  },
];

const dryRun = process.argv.includes("--dry-run");

(async () => {
  try {
    await connectDB();

    const existing = await Reel.find({}).sort({ createdAt: 1 });
    console.log(`Existing reels: ${existing.length}`);

    // Reuse the authors already in the feed; fall back to any user so extra
    // seeds can still be created when the feed has fewer reels than seeds.
    let fallbackAuthor = existing.length ? existing[0].author : null;
    if (!fallbackAuthor) {
      fallbackAuthor = await User.findOne({}).select("_id");
    }
    if (!fallbackAuthor) throw new Error("No users in DB to author the reels");

    for (let i = 0; i < SEEDS.length; i += 1) {
      const seed = SEEDS[i];
      const target = existing[i];

      if (target) {
        console.log(
          `${dryRun ? "DRY-RUN would update" : "UPDATE"} reel ${target._id}\n` +
            `        ${target.videoUrl}\n     -> ${seed.videoUrl}`
        );
        if (!dryRun) {
          await Reel.updateOne(
            { _id: target._id },
            {
              $set: {
                videoUrl: seed.videoUrl,
                thumbnailUrl: seed.thumbnailUrl,
                caption: seed.caption,
                views: seed.views,
              },
            }
          );
        }
      } else {
        console.log(`${dryRun ? "DRY-RUN would create" : "CREATE"} reel -> ${seed.videoUrl}`);
        if (!dryRun) {
          await Reel.create({
            author: fallbackAuthor._id,
            videoUrl: seed.videoUrl,
            thumbnailUrl: seed.thumbnailUrl,
            caption: seed.caption,
            views: seed.views,
            allowComments: true,
            privacy: "everyone",
          });
        }
      }
    }

    const after = await Reel.find({}).sort({ createdAt: 1 });
    console.log(`\nReels now in DB: ${after.length}`);
    for (const reel of after) {
      console.log(`  ${reel._id}  ${reel.videoUrl}`);
    }
  } catch (error) {
    console.error("FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
