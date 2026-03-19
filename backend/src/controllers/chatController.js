const mongoose = require("mongoose");
const ChatConversation = require("../models/ChatConversation");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { normalizeChatRole } = require("../utils/chatRoles");
const {
  toChatConversation,
  toChatMessage,
  toChatParticipant,
} = require("../utils/chatSerializer");

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function buildParticipantKey(firstUserId, secondUserId) {
  return [String(firstUserId), String(secondUserId)].sort().join(":");
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function normalizePaginationValue(value, fallback, max) {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, max);
}

function buildUserSearchQuery(search) {
  const normalized = String(search || "").trim();
  if (!normalized) {
    return {};
  }

  const searchRegex = new RegExp(normalized, "i");
  return {
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { institute: searchRegex },
      { department: searchRegex },
      { position: searchRegex },
    ],
  };
}

async function getConversationUnreadCount(conversationId, viewerId) {
  return ChatMessage.countDocuments({
    conversationId,
    senderId: { $ne: viewerId },
    readBy: { $nin: [viewerId] },
  });
}

async function loadConversationForUser(conversationId, currentUserId) {
  const conversation = await ChatConversation.findById(conversationId).populate(
    "participants",
    "firstName lastName email researcherType avatarUrl location institute department phoneNumber skypeId localTime updatedAt createdAt"
  );

  if (!conversation) {
    throw createHttpError("Conversation not found.", 404);
  }

  const hasAccess = conversation.participants.some(
    (participant) => String(participant?._id || "") === String(currentUserId)
  );

  if (!hasAccess) {
    throw createHttpError("You do not have access to this conversation.", 403);
  }

  return conversation;
}

async function getOrCreateConversation(req, res, next) {
  try {
    const currentUserId = String(req.user._id);
    const recipientId = String(req.body.recipientId || "").trim();

    if (!isValidObjectId(recipientId)) {
      throw createHttpError("A valid recipientId is required.", 400);
    }

    if (recipientId === currentUserId) {
      throw createHttpError("You cannot start a conversation with yourself.", 400);
    }

    const recipient = await User.findById(recipientId).select(
      "firstName lastName email researcherType avatarUrl location institute department phoneNumber skypeId localTime updatedAt createdAt"
    );

    if (!recipient) {
      throw createHttpError("Recipient not found.", 404);
    }

    const participantKey = buildParticipantKey(currentUserId, recipientId);
    let conversation = await ChatConversation.findOne({ participantKey });

    if (!conversation) {
      conversation = await ChatConversation.create({
        participants: [req.user._id, recipient._id],
        participantKey,
        participantRoleMap: {
          [currentUserId]: normalizeChatRole(req.user.researcherType),
          [recipientId]: normalizeChatRole(recipient.researcherType),
        },
      });
    }

    res.status(200).json({
      message: "Conversation ready.",
      conversationId: String(conversation._id),
      participant: toChatParticipant(recipient, {
        lastActivityAt: conversation.lastMessageAt || recipient.updatedAt,
      }),
    });
  } catch (error) {
    next(error);
  }
}

async function listConversations(req, res, next) {
  try {
    const page = normalizePaginationValue(req.query.page, 1, 1000);
    const limit = normalizePaginationValue(req.query.limit, 20, 100);

    const [conversations, total] = await Promise.all([
      ChatConversation.find({ participants: req.user._id })
        .populate(
          "participants",
          "firstName lastName email researcherType avatarUrl location institute department phoneNumber skypeId localTime updatedAt createdAt"
        )
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ChatConversation.countDocuments({ participants: req.user._id }),
    ]);

    const unreadCounts = await Promise.all(
      conversations.map((conversation) =>
        getConversationUnreadCount(conversation._id, req.user._id)
      )
    );

    const serializedConversations = conversations
      .map((conversation, index) =>
        toChatConversation(conversation, req.user._id, unreadCounts[index])
      )
      .filter(Boolean);

    res.status(200).json({
      total,
      page,
      limit,
      data: serializedConversations,
    });
  } catch (error) {
    next(error);
  }
}

async function listContacts(req, res, next) {
  try {
    const searchQuery = buildUserSearchQuery(req.query.search);
    const users = await User.find({
      _id: { $ne: req.user._id },
      ...searchQuery,
    })
      .select(
        "firstName lastName email researcherType avatarUrl location institute department phoneNumber skypeId localTime updatedAt createdAt"
      )
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(50);

    const participantKeys = users.map((user) => buildParticipantKey(req.user._id, user._id));
    const existingConversations = await ChatConversation.find({
      participantKey: { $in: participantKeys },
    }).select("participantKey");

    const conversationMap = new Map(
      existingConversations.map((conversation) => [
        conversation.participantKey,
        String(conversation._id),
      ])
    );

    res.status(200).json({
      data: users.map((user) => ({
        ...toChatParticipant(user),
        conversationId: conversationMap.get(buildParticipantKey(req.user._id, user._id)) || null,
      })),
    });
  } catch (error) {
    next(error);
  }
}

async function listMessages(req, res, next) {
  try {
    const conversation = await loadConversationForUser(req.params.conversationId, req.user._id);
    const limit = normalizePaginationValue(req.query.limit, 200, 500);
    const before = String(req.query.before || "").trim();

    const match = { conversationId: conversation._id };
    if (before) {
      const parsedBefore = new Date(before);
      if (Number.isNaN(parsedBefore.getTime())) {
        throw createHttpError("The before query parameter must be a valid date.", 400);
      }

      match.createdAt = { $lt: parsedBefore };
    }

    const messages = await ChatMessage.find(match).sort({ createdAt: 1 }).limit(limit);

    res.status(200).json({
      data: messages.map((message) => toChatMessage(message, req.user._id)),
      limit,
    });
  } catch (error) {
    next(error);
  }
}

async function sendMessage(req, res, next) {
  try {
    const conversation = await loadConversationForUser(req.params.conversationId, req.user._id);
    const content = String(req.body.content || "").trim();

    if (!content) {
      throw createHttpError("Message content is required.", 400);
    }

    if (content.length > 2000) {
      throw createHttpError("Message content cannot exceed 2000 characters.", 400);
    }

    const senderRole = normalizeChatRole(req.user.researcherType);
    const message = await ChatMessage.create({
      conversationId: conversation._id,
      senderId: req.user._id,
      senderRole,
      content,
      readBy: [req.user._id],
    });

    conversation.lastMessageText = content;
    conversation.lastMessageSenderId = req.user._id;
    conversation.lastMessageSenderRole = senderRole;
    conversation.lastMessageAt = message.createdAt;
    conversation.participantRoleMap = {
      ...Object.fromEntries(
        conversation.participantRoleMap && typeof conversation.participantRoleMap.entries === "function"
          ? Array.from(conversation.participantRoleMap.entries())
          : Object.entries(conversation.participantRoleMap || {})
      ),
      [String(req.user._id)]: senderRole,
    };
    await conversation.save();

    res.status(201).json(toChatMessage(message, req.user._id));
  } catch (error) {
    next(error);
  }
}

async function markRead(req, res, next) {
  try {
    const conversation = await loadConversationForUser(req.params.conversationId, req.user._id);

    await ChatMessage.updateMany(
      {
        conversationId: conversation._id,
        senderId: { $ne: req.user._id },
        readBy: { $nin: [req.user._id] },
      },
      {
        $addToSet: {
          readBy: req.user._id,
        },
      }
    );

    res.status(200).json({
      message: "Messages marked as read.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrCreateConversation,
  listConversations,
  listContacts,
  listMessages,
  sendMessage,
  markRead,
};
