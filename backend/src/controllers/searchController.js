const Post = require("../models/Post");
const User = require("../models/User");
const Group = require("../models/Group");
const { toFeedPost } = require("../utils/postSerializer");
const toPublicUser = require("../utils/toPublicUser");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const DEFAULT_DEPARTMENTS = [
  {
    name: "Department of Electrical and Electronics Engineering",
    shortName: "EEE",
    faculty: "Faculty of Engineering",
    membersCount: 65,
  },
  {
    name: "Department of Computer Science & Engineering",
    shortName: "CSE",
    faculty: "Faculty of Computer Science",
    membersCount: 120,
  },
  {
    name: "Department of Food Engineering & Technology",
    shortName: "FET",
    faculty: "Faculty of Applied Sciences",
    membersCount: 55,
  },
  {
    name: "Faculty of Nursing & Health Sciences",
    shortName: "NHS",
    faculty: "Medical Sciences",
    membersCount: 38,
  },
  {
    name: "Department of Sociology & Anthropology",
    shortName: "SOC",
    faculty: "Social Sciences",
    membersCount: 42,
  },
  {
    name: "Department of Zoology & Wildlife Biology",
    shortName: "ZOO",
    faculty: "Biological Sciences",
    membersCount: 29,
  },
  {
    name: "Department of Biological Sciences & Genetics",
    shortName: "BIO",
    faculty: "Life Sciences",
    membersCount: 48,
  },
  {
    name: "Department of Data Science & Machine Intelligence",
    shortName: "DSMI",
    faculty: "Computational Research",
    membersCount: 84,
  },
];

const DEFAULT_PHOTOS = [
  { id: "ph-1", src: "/images/elements/light.jpg", title: "Photonics Laboratory Study", author: "Dr. Amy Watson" },
  { id: "ph-2", src: "/images/elements/dark.jpg", title: "Astronomy Dark Field Capture", author: "Prof. John Carter" },
  { id: "ph-3", src: "/images/elements/image.jpg", title: "Quantum Telemetry Experiment", author: "Danial Cardos" },
  { id: "ph-4", src: "/images/elements/image2.jpg", title: "Bio-Engineering Cell Structure", author: "Sara Jean" },
  { id: "ph-5", src: "/images/elements/image3.jpg", title: "Autonomous Robotics Field Array", author: "Muhammad A." },
  { id: "ph-6", src: "/images/elements/image4.jpg", title: "Neural Architecture Diagram", author: "William Jhon" },
];

const DEFAULT_VIDEOS = [
  {
    id: "vid-1",
    title: "Autonomous Quadruped Robot Field Testing 🤖⚡",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/resources/post-video1.jpg",
    authorName: "Dr. Amy Watson",
    published: "2 hours ago",
    views: 4500,
  },
  {
    id: "vid-2",
    title: "Quantum Superposition in Room Temperature Solids",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "/images/resources/post-video2.jpg",
    authorName: "Prof. John Carter",
    published: "Yesterday",
    views: 3200,
  },
  {
    id: "vid-3",
    title: "Deep Learning for Genomic Sequence Assembly",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "/images/resources/post-video3.jpg",
    authorName: "Danial Cardos",
    published: "3 days ago",
    views: 1800,
  },
  {
    id: "vid-4",
    title: "High Performance Cloud Computing & Distributed Systems",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/resources/post-video4.jpg",
    authorName: "Sara Jean",
    published: "1 week ago",
    views: 6100,
  },
  {
    id: "vid-5",
    title: "Next-Gen Quantum Network Simulation & Benchmarks",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "/images/resources/post-video5.jpg",
    authorName: "Dr. Amy Watson",
    published: "2 weeks ago",
    views: 8900,
  },
  {
    id: "vid-6",
    title: "Computer Vision & Autonomous Robotics Lecture",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "/images/resources/post-video6.jpg",
    authorName: "Muhammad A.",
    published: "3 weeks ago",
    views: 11200,
  },
  {
    id: "vid-7",
    title: "Computer Graphics and Ray Tracing Innovations",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/resources/post-video6.jpg",
    authorName: "William Jhon",
    published: "1 month ago",
    views: 5400,
  },
  {
    id: "vid-8",
    title: "Modern Machine Learning Infrastructures & LLMs",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "/images/resources/post-video8.jpg",
    authorName: "Prof. John Carter",
    published: "1 month ago",
    views: 9400,
  },
  {
    id: "vid-9",
    title: "Micro-Robotics & Molecular Computing Seminar",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "/images/resources/post-video9.jpg",
    authorName: "Sara Jean",
    published: "2 months ago",
    views: 3900,
  },
  {
    id: "vid-10",
    title: "Advanced Data Structures & Algorithms Masterclass",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/resources/post-video10.jpg",
    authorName: "Danial Cardos",
    published: "2 months ago",
    views: 15400,
  },
  {
    id: "vid-11",
    title: "Cloud Native Software Architectures for 2026",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "/images/resources/post-video11.jpg",
    authorName: "Muhammad A.",
    published: "3 months ago",
    views: 7800,
  },
  {
    id: "vid-12",
    title: "Computer Science Frontiers & Engineering Keynote",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/resources/post-video6.jpg",
    authorName: "Dr. Amy Watson",
    published: "3 months ago",
    views: 13500,
  },
];

async function globalSearch(req, res, next) {
  try {
    const rawQuery = String(req.query.q || req.query.search || "").trim();
    const category = String(req.query.category || "all").trim().toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);
    const viewerId = req.user?._id || null;

    const regex = rawQuery ? new RegExp(escapeRegex(rawQuery), "i") : null;

    // 1. Posts Query
    let postsQuery = {};
    if (regex) {
      postsQuery = {
        $or: [
          { title: regex },
          { content: regex },
          { location: regex },
          { feeling: regex },
          { activityLabel: regex },
        ],
      };
    }

    const matchedPosts = await Post.find(postsQuery)
      .populate("author")
      .populate("comments.user")
      .populate("reactions.user", "firstName lastName avatarUrl handle email role headline")
      .sort({ createdAt: -1 })
      .limit(limit);

    const serializedPosts = matchedPosts.map((p) => toFeedPost(p, viewerId));

    // 2. Members / Users Query
    let usersQuery = {};
    if (regex) {
      usersQuery = {
        $or: [
          { firstName: regex },
          { lastName: regex },
          { username: regex },
          { email: regex },
          { department: regex },
          { institute: regex },
          { position: regex },
          { bio: regex },
          { researcherType: regex },
        ],
      };
    }

    const matchedUsers = await User.find(usersQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit);

    const serializedMembers = matchedUsers.map((u) => {
      const pub = toPublicUser(u);
      return {
        id: pub.id,
        name: `${pub.firstName || ""} ${pub.lastName || ""}`.trim() || pub.username || pub.email,
        handle: pub.username ? `@${pub.username}` : `@${pub.id.slice(-6)}`,
        email: pub.email,
        department: pub.department || pub.institute || "Department of Academic Research",
        institute: pub.institute || "Socimo University",
        position: pub.position || pub.researcherType || "Researcher",
        avatarUrl: pub.avatarUrl || "/images/resources/user.jpg",
        isFollowing: false,
      };
    });

    // 3. Groups Query
    let groupsQuery = {};
    if (regex) {
      groupsQuery = {
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { handle: regex },
        ],
      };
    }

    const matchedGroups = await Group.find(groupsQuery)
      .sort({ createdAt: -1 })
      .limit(limit);

    const serializedGroups = matchedGroups.map((g) => ({
      id: String(g._id),
      name: g.name,
      handle: g.handle || g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: g.description || "Academic research discussion group.",
      category: g.category || "General",
      memberCount: Array.isArray(g.members) ? g.members.length : 12,
      memberCountDisplay: g.memberCountDisplay || `${Array.isArray(g.members) ? g.members.length : 12} Members`,
      coverUrl: g.coverUrl || "/images/resources/group1.jpg",
      iconUrl: g.iconUrl || "/images/resources/user.jpg",
      isMember: viewerId && Array.isArray(g.members) ? g.members.some((m) => String(m) === String(viewerId)) : false,
    }));

    // If few or no groups found in DB, provide filtered defaults or template defaults
    const defaultGroupList = [
      { id: "grp-1", name: "Sports Punch", category: "Sports", memberCountDisplay: "125M Members", coverUrl: "/images/resources/group1.jpg" },
      { id: "grp-2", name: "Asian Girls", category: "Social", memberCountDisplay: "12k Members", coverUrl: "/images/resources/group2.jpg" },
      { id: "grp-3", name: "Graphic Design", category: "Creative", memberCountDisplay: "125M Members", coverUrl: "/images/resources/group3.jpg" },
      { id: "grp-4", name: "Family Lovers", category: "Community", memberCountDisplay: "1M Members", coverUrl: "/images/resources/group4.jpg" },
      { id: "grp-5", name: "School Mates", category: "Education", memberCountDisplay: "22M Members", coverUrl: "/images/resources/group5.jpg" },
      { id: "grp-6", name: "Panama Beach", category: "Travel", memberCountDisplay: "5M Members", coverUrl: "/images/resources/group6.jpg" },
      { id: "grp-7", name: "Online Teching", category: "Technology", memberCountDisplay: "52k Members", coverUrl: "/images/resources/group7.jpg" },
      { id: "grp-8", name: "Child Cares", category: "Family", memberCountDisplay: "1M Members", coverUrl: "/images/resources/group8.jpg" },
      { id: "grp-9", name: "Fun Art", category: "Art", memberCountDisplay: "35k Members", coverUrl: "/images/resources/group9.jpg" },
      { id: "grp-10", name: "Kids Players", category: "Gaming", memberCountDisplay: "10M Members", coverUrl: "/images/resources/group10.jpg" },
      { id: "grp-11", name: "Goldi Friends", category: "Lifestyle", memberCountDisplay: "14M Members", coverUrl: "/images/resources/group11.jpg" },
    ];

    let finalGroups = serializedGroups;
    if (regex) {
      const matchedDefaults = defaultGroupList.filter((g) => regex.test(g.name) || regex.test(g.category));
      finalGroups = [...finalGroups, ...matchedDefaults];
    }
    const remainingGroups = defaultGroupList.filter((dg) => !finalGroups.some((fg) => fg.name === dg.name));
    finalGroups = [...finalGroups, ...remainingGroups].slice(0, 24);

    // 4. Photos
    // Gather from matched posts with image attachment or displayImageUrl
    const postPhotos = serializedPosts
      .filter((p) => p.image || (p.attachmentType === "image" && p.attachmentUrl) || (p.images && p.images.length > 0))
      .flatMap((p) => {
        const imgs = [];
        if (p.image) imgs.push({ id: `${p.id}-img`, src: p.image, title: p.title || p.content, author: p.authorName });
        if (p.attachmentType === "image" && p.attachmentUrl && p.attachmentUrl !== p.image) {
          imgs.push({ id: `${p.id}-att`, src: p.attachmentUrl, title: p.title || p.content, author: p.authorName });
        }
        if (Array.isArray(p.images)) {
          p.images.forEach((imgSrc, idx) => {
            if (imgSrc !== p.image && imgSrc !== p.attachmentUrl) {
              imgs.push({ id: `${p.id}-gal-${idx}`, src: imgSrc, title: p.title || p.content, author: p.authorName });
            }
          });
        }
        return imgs;
      });

    // Merge with defaults: matched first, then remaining defaults
    const filteredDefaultPhotos = regex
      ? DEFAULT_PHOTOS.filter((ph) => regex.test(ph.title) || regex.test(ph.author))
      : DEFAULT_PHOTOS;
    const remainingPhotos = DEFAULT_PHOTOS.filter((dp) => !filteredDefaultPhotos.some((fp) => fp.id === dp.id));
    const finalPhotos = [...postPhotos, ...filteredDefaultPhotos, ...remainingPhotos].slice(0, 24);

    // 5. Videos
    const postVideos = serializedPosts
      .filter((p) => p.type === "video" || p.attachmentType === "video" || p.videoUrl || p.embedUrl)
      .map((p) => ({
        id: p.id,
        title: p.title || p.content || "Research Video Presentation",
        src: p.videoUrl || p.attachmentUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        poster: p.image || "/images/resources/post-video1.jpg",
        authorName: p.authorName,
        published: p.published,
        views: p.stats?.viewCount || 120,
      }));

    const filteredDefaultVideos = regex
      ? DEFAULT_VIDEOS.filter((v) => regex.test(v.title) || regex.test(v.authorName))
      : DEFAULT_VIDEOS;
    const remainingVideos = DEFAULT_VIDEOS.filter((dv) => !filteredDefaultVideos.some((fv) => fv.id === dv.id));
    const finalVideos = [...postVideos, ...filteredDefaultVideos, ...remainingVideos].slice(0, 18);

    // 6. Departments
    // Collect departments from users
    const userDepartments = await User.distinct("department", { department: { $exists: true, $ne: "" } });
    const allDeptNames = Array.from(
      new Set([
        ...DEFAULT_DEPARTMENTS.map((d) => d.name),
        ...userDepartments.filter(Boolean),
      ])
    );

    let departmentsList = allDeptNames
      .map((name) => {
        const found = DEFAULT_DEPARTMENTS.find((d) => d.name === name);
        return {
          name,
          shortName: found?.shortName || name.split(" ").map((w) => w[0]).join("").slice(0, 4).toUpperCase(),
          faculty: found?.faculty || "Academic Division",
          membersCount: found?.membersCount || Math.floor(Math.random() * 40) + 20,
        };
      })
      .filter((d) => (regex ? regex.test(d.name) || regex.test(d.faculty) || regex.test(d.shortName) : true));

    const remainingDepts = DEFAULT_DEPARTMENTS.filter((dd) => !departmentsList.some((dl) => dl.name === dd.name));
    departmentsList = [...departmentsList, ...remainingDepts].slice(0, 24);

    // Calculate total count
    const counts = {
      all: serializedPosts.length + serializedMembers.length + departmentsList.length + finalPhotos.length + finalVideos.length + finalGroups.length,
      posts: serializedPosts.length,
      departments: departmentsList.length,
      members: serializedMembers.length,
      photos: finalPhotos.length,
      videos: finalVideos.length,
      groups: finalGroups.length,
    };

    res.status(200).json({
      query: rawQuery,
      category,
      counts,
      posts: serializedPosts,
      members: serializedMembers,
      departments: departmentsList,
      photos: finalPhotos,
      videos: finalVideos,
      groups: finalGroups,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  globalSearch,
};
