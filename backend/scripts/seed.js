const path = require("path");
const bcrypt = require("bcryptjs");

process.env.NODE_ENV = process.env.NODE_ENV || "development";
require(path.resolve(__dirname, "../src/config/loadEnv"))();

const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Post = require("../src/models/Post");
const ChatConversation = require("../src/models/ChatConversation");
const ChatMessage = require("../src/models/ChatMessage");

const AVATAR_BASE = "https://randomuser.me/api/portraits";
const PHOTO = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const FIRST_NAMES = [
  "Aarav", "Bianca", "Chen", "Diego", "Elif", "Fatima", "Grace", "Hassan",
  "Isabella", "Jin", "Kwame", "Lena", "Mateo", "Nadia", "Omar", "Priya",
  "Quinn", "Ravi", "Sofia", "Tariq", "Uma", "Viktor", "Wei", "Yara", "Zane",
];

const LAST_NAMES = [
  "Sharma", "Rossi", "Wang", "Fernandez", "Demir", "Ahmed", "Nakamura",
  "Khan", "Silva", "Okafor", "Muller", "Costa", "Ivanov", "Petrov", "Nguyen",
  "Garcia", "Haddad", "Kim", "Osei", "Ali", "Johansson", "Brown", "Patel",
  "Mensah", "Lopez",
];

const INSTITUTES = [
  "Bz University, Pakistan",
  "Oxford University, UK",
  "MIT, USA",
  "University of Toronto, Canada",
  "National University of Singapore",
  "Karolinska Institute, Sweden",
  "ETH Zurich, Switzerland",
  "University of Melbourne, Australia",
  "Cairo University, Egypt",
  "Indian Institute of Science, India",
  "University of Nairobi, Kenya",
  "University of Tokyo, Japan",
];

const DEPARTMENTS = [
  "Department of Computer Science",
  "Department of Sociology",
  "Department of Medicine",
  "Department of Physics",
  "Department of Economics",
  "Department of Biotechnology",
  "Department of Psychology",
  "Department of Environmental Science",
];

const POSITIONS = [
  "Research Assistant",
  "PhD Candidate",
  "Postdoctoral Researcher",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Senior Lecturer",
  "Lab Manager",
];

const RESEARCHER_TYPES = ["researcher", "academic", "ngo", "medical"];

const DISCIPLINES = [
  "Artificial Intelligence", "Machine Learning", "Sociology", "Public Health",
  "Quantum Physics", "Economics", "Genomics", "Cognitive Science",
  "Climate Change", "Data Science", "Neuroscience", "Education",
];

const SKILLS = [
  "Python", "R", "Data Analysis", "Qualitative Research", "Lab Experimentation",
  "Statistical Modeling", "Deep Learning", "Field Work", "Grant Writing",
  "Peer Review", "Teaching", "Public Speaking",
];

const LOCATIONS = [
  "Islamabad, Pakistan", "London, UK", "Boston, USA", "Toronto, Canada",
  "Singapore", "Stockholm, Sweden", "Zurich, Switzerland", "Melbourne, Australia",
  "Cairo, Egypt", "Bengaluru, India", "Nairobi, Kenya", "Tokyo, Japan",
];

const RESEARCH_TOPICS = [
  "Inclusive field trials for rural healthcare delivery",
  "Supervision as a personnel development device",
  "Cross-cultural validation of cognitive assessment tools",
  "Open-source tooling for reproducible ML research",
  "Longitudinal study on micro-credential adoption",
  "Agent-based modeling of epidemic spread in urban grids",
  "Participatory budgeting and civic trust in local government",
  "Early-career mentoring outcomes across disciplines",
  "Solar microgrids and household energy security",
  "Multilingual NLP benchmarks for low-resource languages",
  "Genomic diversity mapping in coastal populations",
  "Attention networks and reading comprehension in children",
];

const POST_CONTENTS = [
  "Sharing some early results from our latest round of data collection. Feedback is very welcome.",
  "Long read on the methodology behind our ongoing field study. Constructive criticism appreciated.",
  "Just published a preprint with the team. Thread with the key figures below.",
  "Running a workshop next month on reproducible pipelines. Registration is open to all departments.",
  "A quick summary of the seminar I attended last week and the open questions it raised.",
  "We are recruiting participants for a follow-up survey. DM me if you want the link.",
  "The dataset behind our paper is now public. Reproducibility was a core goal this time.",
  "Field notes from week three: response rates are up, and the qualitative patterns are striking.",
];

const ARTICLE_CTAS = ["Read Paper", "Read Article", "View Preprint", "Open Journal"];
const PREMIUM_CTAS = ["Buy Now", "Pre-order", "Get Access"];
const SPONSOR_CTAS = ["Shop Now", "Learn More", "Get Started"];

function pick(array, index) {
  return array[index % array.length];
}

function avatar(gender, n) {
  return `${AVATAR_BASE}/${gender}/${n % 99}.jpg`;
}

function buildUsers(count) {
  const users = [];
  const usedEmails = new Set();

  for (let i = 0; i < count; i += 1) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const gender = i % 2 === 0 ? "women" : "men";
    let email;
    do {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@research.test`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    users.push({
      firstName,
      lastName,
      email,
      researcherType: RESEARCHER_TYPES[i % RESEARCHER_TYPES.length],
      institute: pick(INSTITUTES, i),
      department: pick(DEPARTMENTS, i),
      position: pick(POSITIONS, i),
      gender,
      avatarUrl: avatar(gender, i * 5),
      coverImageUrl: PHOTO(`cover-${i}`, 1200, 400),
      bio: `Researcher focused on ${pick(RESEARCH_TOPICS, i).toLowerCase()}. Open to collaboration across departments and institutions.`,
      location: pick(LOCATIONS, i),
      website: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.research.test`,
      phoneNumber: `+1-555-01${String(i).padStart(2, "0")}`,
      skypeId: `live:${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      localTime: `${8 + (i % 10)}:${(i % 2 === 0 ? "00" : "30")}${i % 2 === 0 ? "AM" : "PM"}`,
      disciplines: [pick(DISCIPLINES, i), pick(DISCIPLINES, i + 3)],
      skills: [pick(SKILLS, i), pick(SKILLS, i + 4), pick(SKILLS, i + 7)],
      following: [],
    });
  }

  return users;
}

function buildFollowMap(users) {
  const followMap = new Map();
  users.forEach((user) => followMap.set(user._id.toString(), []));

  users.forEach((user) => {
    const targets = users
      .filter((candidate) => candidate._id.toString() !== user._id.toString())
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + (user._id.toString().charCodeAt(0) % 4));

    targets.forEach((target) => {
      user.following.push(target._id);
      followMap.get(target._id.toString()).push(user._id);
    });
  });

  return followMap;
}

function buildPostComments(authors) {
  return authors.slice(0, 3).map((author, index) => ({
    user: author._id,
    message: index % 2 === 0
      ? "Great work — I would love to see the supplementary materials."
      : "This connects nicely with work we are doing on a similar question.",
  }));
}

function buildPostReactions(authors) {
  const types = ["like", "love", "haha", "wow", "sad"];
  return authors.slice(0, 4).map((author, index) => ({
    user: author._id,
    type: types[(index + author._id.toString().charCodeAt(0)) % types.length],
  }));
}

function buildPosts(users) {
  const posts = [];
  const count = users.length;

  for (let i = 0; i < count; i += 1) {
    const author = users[i];
    const likers = users.filter((u) => u._id.toString() !== author._id.toString()).slice(0, 8);
    const topic = pick(RESEARCH_TOPICS, i);
    const image = PHOTO(`post-${i}`, 640, 360);
    const base = {
      author: author._id,
      commentsOpen: i % 3 === 0,
      activityFeed: true,
      myStory: i % 4 !== 0,
      likes: likers.map((u) => u._id),
      reactions: buildPostReactions(likers),
      comments: buildPostComments(likers),
      shareCount: (i * 7) % 25,
    };

    switch (i % 10) {
      case 0:
        posts.push({
          ...base,
          postType: "custom",
          activityLabel: "shared a thought",
          content: pick(POST_CONTENTS, i),
        });
        break;

      case 1:
        posts.push({
          ...base,
          postType: "article",
          activityLabel: "shared an article",
          title: `How we measured ${topic.toLowerCase()}`,
          content: `Full write-up of the study design, sample, and limitations. ${pick(POST_CONTENTS, i)}`,
          displayImageUrl: image,
          attachmentUrl: `https://research.test/paper/${i}`,
          attachmentType: "file",
          attachmentName: `${topic.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          ctaLabel: pick(ARTICLE_CTAS, i),
          ctaHref: `https://research.test/paper/${i}`,
        });
        break;

      case 2:
        posts.push({
          ...base,
          postType: "premium",
          activityLabel: "shared a premium product",
          title: `${pick(RESEARCH_TOPICS, i + 1)} — 2026 Edition`,
          content: "Exclusive access to the full dataset and visual appendix for subscribers.",
          displayImageUrl: PHOTO(`premium-${i}`, 640, 640),
          ctaLabel: pick(PREMIUM_CTAS, i),
          ctaHref: `https://research.test/shop/${i}`,
          fetchedImageLabel: "premium",
        });
        break;

      case 3:
        posts.push({
          ...base,
          postType: "image",
          activityLabel: "created a post",
          title: "Field observation",
          content: `One of the more striking visual patterns we captured. ${topic}`,
          displayImageUrl: image,
          attachmentUrl: image,
          attachmentType: "image",
        });
        break;

      case 4:
        posts.push({
          ...base,
          postType: "album",
          activityLabel: "added an image album",
          title: "Visual research notes from the latest field study",
          content: "A selection of annotated photographs from the recent data collection trip.",
          galleryImages: [0, 1, 2, 3, 4].map((n) => PHOTO(`album-${i}-${n}`, 480, 480)),
          morePhotosCount: (i * 3) % 20,
          attachmentType: "image",
        });
        break;

      case 5:
        posts.push({
          ...base,
          postType: "link",
          activityLabel: "shared a link",
          title: "A closer look at the methods section",
          content: "Worth a read before the next lab meeting.",
          linkUrl: `https://research.test/papers/${i}`,
          displayImageUrl: PHOTO(`link-${i}`, 640, 360),
          ctaLabel: "Read More",
          ctaHref: `https://research.test/papers/${i}`,
          fetchedImageLabel: "fetched-image",
        });
        break;

      case 6:
        posts.push({
          ...base,
          postType: "video",
          activityLabel: "shared a video",
          title: topic,
          content: "A short walkthrough of the experiment setup and the questions we are asking.",
          attachmentUrl: "https://www.youtube.com/embed/zdow47FQRfQ",
          attachmentType: "video",
          displayImageUrl: PHOTO(`video-${i}`, 640, 360),
        });
        break;

      case 7:
        posts.push({
          ...base,
          postType: "gif",
          activityLabel: "shared a gif",
          content: "That feeling when the experiment finally behaves.",
          gifPreviewUrl: PHOTO(`gif-preview-${i}`, 320, 240),
          gifDataUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
          attachmentType: "image",
        });
        break;

      case 8:
        posts.push({
          ...base,
          postType: "audio",
          activityLabel: "shared an audio clip",
          title: "Interview excerpt",
          content: "Highlights from the recorded focus group session.",
          audioSources: [
            {
              url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              mimeType: "audio/mpeg",
            },
          ],
        });
        break;

      default:
        posts.push({
          ...base,
          postType: "sponsor",
          activityLabel: "sponsored a product",
          title: "Sponsored research equipment bundle",
          content: "Trusted gear for field and lab researchers.",
          displayImageUrl: PHOTO(`sponsor-${i}`, 640, 360),
          ctaLabel: pick(SPONSOR_CTAS, i),
          ctaHref: `https://research.test/sponsor/${i}`,
          sponsorItems: [0, 1, 2].map((n) => ({
            title: `Research Kit ${n + 1}`,
            imageUrl: PHOTO(`sponsor-item-${i}-${n}`, 240, 240),
            priceLabel: `$${19 + n * 12}`,
            href: `https://research.test/shop/item/${i}-${n}`,
            ctaLabel: "Shop Now",
            shareLabel: "Share",
            likeLabel: "Like",
          })),
        });
        break;
    }
  }

  return posts;
}

function buildConversations(users, messagesPerConversation) {
  const conversations = [];
  const messages = [];
  const chatRoles = ["student", "ngo", "medical", "other"];

  const pairs = [];
  for (let i = 0; i < Math.min(users.length, 10); i += 2) {
    const a = users[i];
    const b = users[(i + 1) % users.length];
    if (a._id.toString() === b._id.toString()) {
      continue;
    }
    pairs.push([a, b]);
  }

  pairs.forEach(([a, b], index) => {
    const participantKey = [String(a._id), String(b._id)].sort().join(":");
    const conversation = {
      participants: [a._id, b._id],
      participantKey,
      participantRoleMap: {
        [a._id.toString()]: chatRoles[index % chatRoles.length],
        [b._id.toString()]: chatRoles[(index + 1) % chatRoles.length],
      },
    };
    conversations.push(conversation);

    let lastMessageAt = new Date(Date.now() - (index + 1) * 3600_000);
    const convoMessages = [];
    for (let m = 0; m < messagesPerConversation; m += 1) {
      const sender = m % 2 === 0 ? a : b;
      lastMessageAt = new Date(lastMessageAt.getTime() + 900_000);
      convoMessages.push({
        conversationId: conversation,
        senderId: sender._id,
        senderRole: conversation.participantRoleMap[sender._id.toString()],
        content: pick(POST_CONTENTS, m + index),
        readBy: m === messagesPerConversation - 1 ? [a._id, b._id] : [sender._id],
        createdAt: lastMessageAt,
      });
    }
    messages.push(...convoMessages);

    const lastMessage = convoMessages[convoMessages.length - 1];
    conversation.lastMessageText = lastMessage.content;
    conversation.lastMessageSenderId = lastMessage.senderId;
    conversation.lastMessageSenderRole = lastMessage.senderRole;
    conversation.lastMessageAt = lastMessageAt;
  });

  return { conversations, messages };
}

async function wipeCollections() {
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    ChatConversation.deleteMany({}),
    ChatMessage.deleteMany({}),
  ]);
}

async function run() {
  const USER_COUNT = 24;
  const POST_COUNT = 24;
  const MESSAGES_PER_CONVERSATION = 8;

  await connectDB();
  await wipeCollections();

  const passwordHash = await bcrypt.hash("password123", 12);

  const userDocs = buildUsers(USER_COUNT).map((user) => ({
    ...user,
    passwordHash,
  }));
  const users = await User.insertMany(userDocs);
  console.log(`Seeded ${users.length} users`);

  const followMap = buildFollowMap(users);
  for (const [id, following] of followMap) {
    await User.updateOne({ _id: id }, { $set: { following } });
  }
  console.log("Seeded following relationships");

  const posts = buildPosts(users).slice(0, POST_COUNT);
  const insertedPosts = await Post.insertMany(posts);
  console.log(`Seeded ${insertedPosts.length} posts`);

  const { conversations, messages } = buildConversations(users, MESSAGES_PER_CONVERSATION);
  const insertedConversations = await ChatConversation.insertMany(conversations);
  messages.forEach((message) => {
    const convo = insertedConversations.find(
      (c) => c.participantKey === message.conversationId.participantKey
    );
    message.conversationId = convo._id;
  });
  const insertedMessages = await ChatMessage.insertMany(messages);
  console.log(`Seeded ${insertedConversations.length} conversations`);
  console.log(`Seeded ${insertedMessages.length} chat messages`);

  console.log("Seed complete.");
  process.exit(0);
}

run().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
});
