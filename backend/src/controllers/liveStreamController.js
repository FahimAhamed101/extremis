const LiveStream = require("../models/LiveStream");

const DEFAULT_INITIAL_MESSAGES = [
  {
    senderName: "Maria K",
    senderAvatar: "/images/resources/userlist-2.jpg",
    message: "what's liz short for? :)",
  },
  {
    senderName: "Danial Cardos",
    senderAvatar: "/images/resources/userlist-1.jpg",
    message: "Elizabeth lol",
  },
  {
    senderName: "Danial Cardos",
    senderAvatar: "/images/resources/userlist-1.jpg",
    message: "wanna know whats my second guess was?",
  },
  {
    senderName: "Maria K",
    senderAvatar: "/images/resources/userlist-2.jpg",
    message: "yes",
  },
  {
    senderName: "Danial Cardos",
    senderAvatar: "/images/resources/userlist-1.jpg",
    message: "Disney's the lizard king",
  },
  {
    senderName: "Danial Cardos",
    senderAvatar: "/images/resources/userlist-1.jpg",
    message: "i know him 5 years ago",
  },
  {
    senderName: "Maria K",
    senderAvatar: "/images/resources/userlist-2.jpg",
    message: "coooooooooool dude ;)",
  },
  {
    senderName: "Maria K",
    senderAvatar: "/images/resources/userlist-2.jpg",
    message: "hahaahhhahah",
  },
];

// Ensure an active stream exists or create a default one
async function getOrCreateActiveStream() {
  let stream = await LiveStream.findOne({ status: "live" }).sort({ createdAt: -1 });
  if (!stream) {
    stream = await LiveStream.create({
      title: "Welcome to Socimo Live Room",
      streamerName: "Danial Cardos",
      streamerAvatar: "/images/resources/user.jpg",
      privacy: "Public",
      status: "live",
      viewerCount: 2,
      allowChat: true,
      allowComments: true,
      chatMessages: DEFAULT_INITIAL_MESSAGES.map((msg) => ({
        ...msg,
        createdAt: new Date(),
      })),
    });
  }
  return stream;
}

// GET /api/live-stream/active
exports.getActiveStream = async (req, res, next) => {
  try {
    const stream = await getOrCreateActiveStream();
    return res.status(200).json({
      success: true,
      stream,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/live-stream
exports.listStreams = async (req, res, next) => {
  try {
    const streams = await LiveStream.find().sort({ createdAt: -1 }).limit(20);
    return res.status(200).json({
      success: true,
      streams,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/live-stream/:id
exports.getStreamById = async (req, res, next) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ success: false, message: "Live stream not found." });
    }
    return res.status(200).json({
      success: true,
      stream,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/live-stream/start
exports.startStream = async (req, res, next) => {
  try {
    const {
      title,
      privacy,
      allowChat = true,
      allowComments = true,
      scheduleForLater = false,
      scheduledDate,
    } = req.body;

    const user = req.user;
    const streamerName = user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.email
      : "Danial Cardos";
    const streamerAvatar = (user && user.avatarUrl) ? user.avatarUrl : "/images/resources/user.jpg";

    const newStream = await LiveStream.create({
      title: title && title.trim() ? title.trim() : "Interactive Live Stream",
      streamer: user ? user._id : null,
      streamerName,
      streamerAvatar,
      privacy: privacy || "Public",
      status: scheduleForLater ? "scheduled" : "live",
      viewerCount: 1,
      allowChat: Boolean(allowChat),
      allowComments: Boolean(allowComments),
      scheduledFor: scheduleForLater && scheduledDate ? new Date(scheduledDate) : null,
      startedAt: scheduleForLater ? null : new Date(),
      chatMessages: DEFAULT_INITIAL_MESSAGES.map((msg) => ({
        ...msg,
        createdAt: new Date(),
      })),
    });

    return res.status(201).json({
      success: true,
      stream: newStream,
      message: scheduleForLater ? "Stream scheduled successfully!" : "Stream started live!",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/live-stream/:id/chat
exports.postChatMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, senderName: customName } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message cannot be empty." });
    }

    const stream = await LiveStream.findById(id);
    if (!stream) {
      return res.status(404).json({ success: false, message: "Live stream not found." });
    }

    const user = req.user;
    const senderName = customName || (user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "You"
      : "You");
    const senderAvatar = (user && user.avatarUrl) ? user.avatarUrl : "/images/resources/userlist-1.jpg";

    const newChatMessage = {
      sender: user ? user._id : null,
      senderName,
      senderAvatar,
      message: message.trim(),
      createdAt: new Date(),
    };

    stream.chatMessages.push(newChatMessage);
    await stream.save();

    return res.status(200).json({
      success: true,
      message: "Chat message sent",
      chatMessage: stream.chatMessages[stream.chatMessages.length - 1],
      chatMessages: stream.chatMessages,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/live-stream/:id/end
exports.endStream = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stream = await LiveStream.findById(id);
    if (!stream) {
      return res.status(404).json({ success: false, message: "Live stream not found." });
    }

    stream.status = "ended";
    stream.endedAt = new Date();
    await stream.save();

    return res.status(200).json({
      success: true,
      message: "Live stream ended.",
      stream,
    });
  } catch (error) {
    next(error);
  }
};
