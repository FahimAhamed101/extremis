const Story = require("../models/Story");
const User = require("../models/User");

const SEED_STORIES = [
  {
    authorName: "Dr. Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    authorHeadline: "Biophysics Researcher at Oxford",
    mediaUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1080&q=80",
    mediaType: "image",
    caption: "Excited to share preliminary results from our protein crystallization trial! 🧬🔬",
    viewsCount: 42,
  },
  {
    authorName: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    authorHeadline: "Robotics Engineer",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    mediaType: "video",
    caption: "First autonomous obstacle avoidance test passed on the quad-legged rover! 🤖⚡",
    viewsCount: 68,
  },
  {
    authorName: "Maya Lin",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    authorHeadline: "Climate & Environmental Science",
    mediaUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1080&q=80",
    mediaType: "image",
    caption: "Field expedition collecting alpine microclimate telemetry data at dawn. 🌄❄️",
    viewsCount: 85,
  },
  {
    authorName: "Prof. David Chen",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    authorHeadline: "AI & Deep Learning Fellow",
    mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80",
    mediaType: "image",
    caption: "Keynote presentation ready for the International Computing Symposium! 💻🚀",
    viewsCount: 110,
  },
  {
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    authorHeadline: "Marine Ecology PhD",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    mediaType: "video",
    caption: "Coral reef restoration monitoring footage off the coast. Vibrant biodiversity! 🐠🌊",
    viewsCount: 94,
  },
];

async function ensureSeedStories() {
  const count = await Story.countDocuments();
  if (count === 0) {
    await Story.insertMany(SEED_STORIES);
  }
}

// GET /api/stories
async function getStories(req, res, next) {
  try {
    await ensureSeedStories();

    // Fetch non-expired stories
    const now = new Date();
    const stories = await Story.find({
      $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const currentUserId = req.user?.id ? req.user.id.toString() : null;

    // Group stories by author or format individually
    const formattedStories = stories.map((s) => {
      const isMine = currentUserId && s.author && s.author.toString() === currentUserId;
      const isViewed = currentUserId && Array.isArray(s.viewers) && s.viewers.some((v) => v.toString() === currentUserId);

      return {
        id: s._id.toString(),
        authorId: s.author ? s.author.toString() : null,
        authorName: s.authorName,
        authorAvatar: s.authorAvatar || "/images/resources/user.jpg",
        authorHeadline: s.authorHeadline || "",
        mediaUrl: s.mediaUrl,
        mediaType: s.mediaType || "image",
        caption: s.caption || "",
        viewsCount: s.viewsCount || 0,
        createdAt: s.createdAt,
        isMine: Boolean(isMine),
        isViewed: Boolean(isViewed),
      };
    });

    return res.status(200).json({
      message: "Stories retrieved successfully",
      stories: formattedStories,
    });
  } catch (err) {
    return next(err);
  }
}

// POST /api/stories
async function createStory(req, res, next) {
  try {
    const { mediaUrl, mediaType = "image", caption = "" } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({ message: "Media URL is required for a story" });
    }

    const currentUserId = req.user?.id;
    let authorName = "Research Scholar";
    let authorAvatar = "/images/resources/user.jpg";
    let authorHeadline = "Researcher";

    if (currentUserId) {
      const user = await User.findById(currentUserId).lean();
      if (user) {
        authorName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Researcher";
        authorAvatar = user.avatarUrl || "/images/resources/user.jpg";
        authorHeadline = user.position || user.institute || "";
      }
    }

    const story = await Story.create({
      author: currentUserId || null,
      authorName,
      authorAvatar,
      authorHeadline,
      mediaUrl,
      mediaType: mediaType === "video" ? "video" : "image",
      caption: caption.trim(),
      viewsCount: 0,
      viewers: [],
    });

    return res.status(201).json({
      message: "Story published successfully",
      story: {
        id: story._id.toString(),
        authorId: currentUserId || null,
        authorName,
        authorAvatar,
        authorHeadline,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        viewsCount: 0,
        createdAt: story.createdAt,
        isMine: true,
        isViewed: false,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// POST /api/stories/:id/view
async function viewStory(req, res, next) {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.viewsCount = (story.viewsCount || 0) + 1;

    if (currentUserId && !story.viewers.some((v) => v.toString() === currentUserId.toString())) {
      story.viewers.push(currentUserId);
    }

    await story.save();

    return res.status(200).json({
      message: "Story view recorded",
      viewsCount: story.viewsCount,
    });
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/stories/:id
async function deleteStory(req, res, next) {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id ? req.user.id.toString() : null;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.author && currentUserId && story.author.toString() !== currentUserId) {
      return res.status(403).json({ message: "You are not authorized to delete this story" });
    }

    await Story.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Story deleted successfully",
      id,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getStories,
  createStory,
  viewStory,
  deleteStory,
};
