require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Post = require("../src/models/Post");
const User = require("../src/models/User");

async function seed() {
  await connectDB();

  let shivanshu = await User.findOne({ username: "shivanshu" });
  if (!shivanshu) {
    shivanshu = await User.create({
      firstName: "shivanshu",
      lastName: "",
      username: "shivanshu",
      email: "shivanshu@app.test",
      passwordHash: "dummy",
      avatarUrl: "https://picsum.photos/seed/shivanshu/200/200",
      location: "Mumbai",
      bio: "Feeling loved"
    });
  }

  let pinky = await User.findOne({ username: "pinky" });
  if (!pinky) {
    pinky = await User.create({
      firstName: "Priyanka",
      lastName: "Meena",
      username: "pinky",
      email: "pinky@app.test",
      passwordHash: "dummy",
      avatarUrl: "https://picsum.photos/seed/priyanka/200/200",
      location: "Mumbai",
      bio: "Feeling happy"
    });
  }

  let spacester = await User.findOne({ username: "spacester" });
  if (!spacester) {
    spacester = await User.create({
      firstName: "Spacester",
      lastName: "Global",
      username: "spacester",
      email: "spacester@app.test",
      passwordHash: "dummy",
      avatarUrl: "https://picsum.photos/seed/spacester/200/200",
      location: "Global",
      bio: "Connecting everyone"
    });
  }

  const baseTime = Date.now();

  // 1. Post 1: shivanshu raining post (exact screenshot)
  await Post.findOneAndUpdate(
    { content: /#raining/i },
    {
      author: shivanshu._id,
      postType: "image",
      activityLabel: "Feeling loved",
      feeling: "Feeling loved",
      location: "Mumbai",
      content: "It's #raining have a great day @shivanshu",
      displayImageUrl: "https://picsum.photos/seed/raining-day/640/480",
      attachmentUrl: "https://picsum.photos/seed/raining-day/640/480",
      attachmentType: "image",
      activityFeed: true,
      commentsOpen: true,
      reactions: [
        { user: pinky._id, type: "love" },
        { user: spacester._id, type: "like" },
        { user: shivanshu._id, type: "haha" }
      ],
      comments: [
        { user: pinky._id, message: "Stay dry! Awesome day ahead." }
      ],
      viewCount: 3,
      createdAt: new Date(baseTime)
    },
    { upsert: true, new: true }
  );

  // 2. Post 2: pinky watermelon post (exact screenshot)
  await Post.findOneAndUpdate(
    { content: /summer vibes/i },
    {
      author: pinky._id,
      postType: "image",
      activityLabel: "Feeling happy",
      feeling: "Feeling happy",
      location: "Mumbai",
      content: "Sweet summer vibes! 🍉🍦",
      displayImageUrl: "https://picsum.photos/seed/watermelon-pattern/640/320",
      attachmentUrl: "https://picsum.photos/seed/watermelon-pattern/640/320",
      attachmentType: "image",
      activityFeed: true,
      commentsOpen: true,
      reactions: [
        { user: shivanshu._id, type: "love" }
      ],
      viewCount: 4,
      createdAt: new Date(baseTime - 3600000)
    },
    { upsert: true, new: true }
  );

  // 3. Post 3: shivanshu tech updates
  await Post.findOneAndUpdate(
    { content: /new updates release/i },
    {
      author: shivanshu._id,
      postType: "image",
      activityLabel: "Feeling inspired",
      feeling: "Feeling inspired",
      location: "Mumbai",
      content: "Late night coding session working on the new updates release 🚀💻 #updates #android",
      displayImageUrl: "https://picsum.photos/seed/tech-desk/640/400",
      attachmentUrl: "https://picsum.photos/seed/tech-desk/640/400",
      attachmentType: "image",
      activityFeed: true,
      commentsOpen: true,
      reactions: [
        { user: spacester._id, type: "love" },
        { user: pinky._id, type: "like" }
      ],
      comments: [
        { user: spacester._id, message: "Looking super clean! Can not wait for the APK." }
      ],
      viewCount: 12,
      createdAt: new Date(baseTime - 7200000)
    },
    { upsert: true, new: true }
  );

  // 4. Post 4: spacester global updates
  await Post.findOneAndUpdate(
    { content: /Connecting people across the globe/i },
    {
      author: spacester._id,
      postType: "image",
      activityLabel: "Feeling proud",
      feeling: "Feeling proud",
      location: "Global",
      content: "Connecting people across the globe with real-time updates! 🌍✨",
      displayImageUrl: "https://picsum.photos/seed/global-city/640/420",
      attachmentUrl: "https://picsum.photos/seed/global-city/640/420",
      attachmentType: "image",
      activityFeed: true,
      commentsOpen: true,
      reactions: [
        { user: shivanshu._id, type: "love" },
        { user: pinky._id, type: "wow" }
      ],
      viewCount: 24,
      createdAt: new Date(baseTime - 10800000)
    },
    { upsert: true, new: true }
  );

  // 5. Post 5: pinky hills
  await Post.findOneAndUpdate(
    { content: /fresh mountain air/i },
    {
      author: pinky._id,
      postType: "image",
      activityLabel: "Feeling excited",
      feeling: "Feeling excited",
      location: "Lonavala",
      content: "Exploring the hills today! Nothing beats fresh mountain air 🍃⛰️",
      displayImageUrl: "https://picsum.photos/seed/mountain-hills/640/440",
      attachmentUrl: "https://picsum.photos/seed/mountain-hills/640/440",
      attachmentType: "image",
      activityFeed: true,
      commentsOpen: true,
      reactions: [
        { user: shivanshu._id, type: "like" }
      ],
      viewCount: 9,
      createdAt: new Date(baseTime - 14400000)
    },
    { upsert: true, new: true }
  );

  // 6. Post 6: shivanshu drone video
  await Post.findOneAndUpdate(
    { content: /Drone test flight/i },
    {
      author: shivanshu._id,
      postType: "video",
      activityLabel: "Feeling amazed",
      feeling: "Feeling amazed",
      location: "Mumbai",
      content: "Drone test flight complete. Stability at 50m altitude is rock solid! 🚁",
      attachmentUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      attachmentType: "video",
      activityFeed: true,
      commentsOpen: true,
      reactions: [
        { user: pinky._id, type: "love" },
        { user: spacester._id, type: "wow" }
      ],
      viewCount: 18,
      createdAt: new Date(baseTime - 18000000)
    },
    { upsert: true, new: true }
  );

  console.log("Rich posts seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
