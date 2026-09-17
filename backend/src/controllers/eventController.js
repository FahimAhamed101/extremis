const mongoose = require("mongoose");
const Event = require("../models/Event");
const { EVENT_CATEGORIES } = require("../models/Event");

const DEFAULT_AVATAR = "/images/resources/user.jpg";
const DEFAULT_LIST_LIMIT = 20;
const MAX_LIST_LIMIT = 50;
const MAX_ATTENDEES = 8;
const RSVP_STATUSES = new Set(["going", "interested", "none"]);

function getRequestBody(req) {
  if (!req || !req.body || typeof req.body !== "object" || Buffer.isBuffer(req.body)) {
    return {};
  }
  return req.body;
}

function getFullName(user) {
  if (!user || typeof user !== "object") {
    return "";
  }
  return `${String(user.firstName || "").trim()} ${String(user.lastName || "").trim()}`.trim();
}

function getRefId(entry) {
  if (!entry) {
    return null;
  }
  if (typeof entry === "object") {
    return entry._id ? String(entry._id) : null;
  }
  return String(entry);
}

function arrayHasUser(list, userId) {
  if (!Array.isArray(list) || !userId) {
    return false;
  }
  const target = String(userId);
  return list.some((entry) => getRefId(entry) === target);
}

function startOfUtcDay(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function parseIsoDate(value) {
  const raw = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return null;
  }

  const [year, month, day] = raw.split("-").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function parseLimit(value, fallback = DEFAULT_LIST_LIMIT, max = MAX_LIST_LIMIT) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(parsed, max);
}

function parseBooleanFlag(value) {
  if (value === true) {
    return true;
  }
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "true" || normalized === "1";
}

function normalizeBoolean(value, fallback) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return fallback;
}

// Returns a normalized URL string, null when absent, or undefined when invalid.
function normalizeCoverImage(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  if (raw.startsWith("/") || raw.startsWith("data:image/")) {
    return raw;
  }

  try {
    const url = new URL(raw);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function toEventDto(event, viewerId) {
  const viewer = viewerId ? String(viewerId) : null;
  const organizerDoc =
    event && event.organizer && typeof event.organizer === "object" && event.organizer._id
      ? event.organizer
      : null;
  const goingList = Array.isArray(event?.going) ? event.going : [];
  const interestedList = Array.isArray(event?.interested) ? event.interested : [];

  const dateValue = event?.date instanceof Date ? event.date : new Date(event?.date);
  const hasValidDate = !Number.isNaN(dateValue.getTime());

  const attendeeAvatars = [];
  const seenAttendees = new Set();
  goingList.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const key = String(entry._id || "");
    const avatar = String(entry.avatarUrl || "").trim();
    if (!avatar || seenAttendees.has(key)) {
      return;
    }
    seenAttendees.add(key);
    attendeeAvatars.push(avatar);
  });

  return {
    id: String(event?._id || ""),
    title: String(event?.title || ""),
    organizer: organizerDoc ? getFullName(organizerDoc) || "Extremis" : "Extremis",
    organizerAvatar: organizerDoc
      ? String(organizerDoc.avatarUrl || "").trim() || DEFAULT_AVATAR
      : DEFAULT_AVATAR,
    category: event?.category || "",
    month: hasValidDate
      ? dateValue.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase()
      : "",
    day: hasValidDate ? String(dateValue.getUTCDate()).padStart(2, "0") : "",
    fullDate: hasValidDate
      ? new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }).format(dateValue)
      : "",
    time: String(event?.time || ""),
    location: String(event?.location || ""),
    isOnline: Boolean(event?.isOnline),
    coverImage: event?.coverImage ? String(event.coverImage) : "",
    description: String(event?.description || ""),
    interestedCount: interestedList.length,
    goingCount: goingList.length,
    isInterested: viewer ? arrayHasUser(interestedList, viewer) : false,
    isGoing: viewer ? arrayHasUser(goingList, viewer) : false,
    attendees: attendeeAvatars.slice(0, MAX_ATTENDEES),
    date: hasValidDate ? dateValue.toISOString().slice(0, 10) : "",
  };
}

async function getEvents(req, res, next) {
  try {
    const limit = parseLimit(req.query?.limit);
    const upcomingOnly = parseBooleanFlag(req.query?.upcoming);

    const filter = {};
    if (upcomingOnly) {
      filter.date = { $gte: startOfUtcDay(new Date()) };
    }

    const sort = upcomingOnly ? { date: 1, createdAt: 1 } : { date: -1, createdAt: -1 };

    const events = await Event.find(filter)
      .sort(sort)
      .limit(limit)
      .populate("organizer")
      .populate("going");

    const viewerId = req.user?._id ? String(req.user._id) : null;

    res.status(200).json({
      events: events.map((event) => toEventDto(event, viewerId)),
    });
  } catch (error) {
    next(error);
  }
}

async function getEventById(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: "Invalid event id." });
      return;
    }

    const event = await Event.findById(eventId).populate("organizer").populate("going");
    if (!event) {
      res.status(404).json({ message: "Event not found." });
      return;
    }

    const viewerId = req.user?._id ? String(req.user._id) : null;
    res.status(200).json({ event: toEventDto(event, viewerId) });
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const body = getRequestBody(req);

    const title = String(body.title || "").trim();
    if (!title) {
      res.status(400).json({ message: "Event title is required." });
      return;
    }
    if (title.length > 300) {
      res.status(400).json({ message: "Event title must be 300 characters or fewer." });
      return;
    }

    const category = String(body.category || "").trim();
    if (!EVENT_CATEGORIES.includes(category)) {
      res.status(400).json({ message: "Event category is not supported." });
      return;
    }

    const parsedDate = parseIsoDate(body.date);
    if (!parsedDate) {
      res.status(400).json({ message: "Event date must be a valid calendar date in YYYY-MM-DD format." });
      return;
    }
    if (parsedDate.getTime() < startOfUtcDay(new Date()).getTime()) {
      res.status(400).json({ message: "Event date must be today or in the future." });
      return;
    }

    const coverImage = normalizeCoverImage(body.coverImage);
    if (coverImage === undefined) {
      res.status(400).json({ message: "Cover image must be a valid URL." });
      return;
    }

    const created = await Event.create({
      title,
      category,
      date: parsedDate,
      time: String(body.time || "").trim().slice(0, 120),
      location: String(body.location || "").trim().slice(0, 300),
      isOnline: normalizeBoolean(body.isOnline, false),
      description: String(body.description || "").trim().slice(0, 4000),
      coverImage,
      organizer: req.user._id,
    });

    const event = await Event.findById(created._id).populate("organizer").populate("going");

    res.status(201).json({
      message: "Event created successfully.",
      event: toEventDto(event, String(req.user._id)),
    });
  } catch (error) {
    next(error);
  }
}

async function rsvpEvent(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: "Invalid event id." });
      return;
    }

    const body = getRequestBody(req);
    const status = String(body.status || "").trim().toLowerCase();
    if (!RSVP_STATUSES.has(status)) {
      res.status(400).json({ message: "RSVP status must be going, interested, or none." });
      return;
    }

    const userId = req.user._id;

    let update;
    let message;
    if (status === "going") {
      update = { $addToSet: { going: userId }, $pull: { interested: userId } };
      message = "You are going to this event.";
    } else if (status === "interested") {
      update = { $addToSet: { interested: userId }, $pull: { going: userId } };
      message = "Event saved to your interested list.";
    } else {
      update = { $pull: { going: userId, interested: userId } };
      message = "Your RSVP was removed.";
    }

    // A single atomic update keeps concurrent RSVPs idempotent and prevents a
    // user from appearing in both "going" and "interested" at the same time.
    const event = await Event.findOneAndUpdate({ _id: eventId }, update, {
      new: true,
    })
      .populate("organizer")
      .populate("going");

    if (!event) {
      res.status(404).json({ message: "Event not found." });
      return;
    }

    res.status(200).json({
      message,
      event: toEventDto(event, String(userId)),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent,
  getEventById,
  getEvents,
  rsvpEvent,
  toEventDto,
  parseIsoDate,
  parseLimit,
};
