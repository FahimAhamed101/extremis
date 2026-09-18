export type CourseReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  avatar: string;
  comment: string;
};

export type CourseCurriculumModule = {
  id: string;
  title: string;
  duration: string;
  lectures: {
    id: string;
    title: string;
    duration: string;
    isFreePreview?: boolean;
  }[];
};

export type CourseInclude = {
  icon: string;
  label: string;
};

export type CourseItem = {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  views: number;
  likes: number;
  dislikes: number;
  instructor: {
    name: string;
    avatar: string;
    lastUpdate: string;
    bio?: string;
    followersCount?: number;
  };
  videoPreview: {
    url: string;
    thumbnail: string;
  };
  description: string;
  extendedDescription: string;
  whatYouWillLearn: string[];
  includes: CourseInclude[];
  curriculum: CourseCurriculumModule[];
  ratingsBreakdown: {
    totalRating: number;
    distribution: {
      star: number;
      percentage: number;
      key: string;
    }[];
  };
  reviews: CourseReview[];
  relatedCourses: {
    id: string;
    title: string;
    img: string;
    price: number;
    instructor?: string;
  }[];
};

export const COURSES_CATALOG: CourseItem[] = [
  {
    id: "learn-basic-javascript",
    title: "Learn Basic Java Scripts",
    category: "Javascript",
    price: 19.99,
    oldPrice: 29.99,
    rating: 4.5,
    views: 1450,
    likes: 200,
    dislikes: 80,
    instructor: {
      name: "Kim Carter",
      avatar: "/images/resources/user1.jpg",
      lastUpdate: "Aug, 27 2021",
      bio: "Senior Frontend Engineer & Curriculum Author with over 10 years experience training global development teams.",
      followersCount: 3420,
    },
    videoPreview: {
      url: "https://www.youtube.com/embed/nOCXXHGMezU",
      thumbnail: "/images/resources/course-2.jpg",
    },
    description:
      "Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.",
    extendedDescription:
      "A complete deep dive from the syntax fundamentals of JavaScript to modern ES6+, DOM manipulation, asynchronous programming, APIs, and building interactive web applications. You will learn best practices, debugging techniques, and project architecture used by modern tech companies.",
    whatYouWillLearn: [
      "Master modern JavaScript (ES6, ES7, ES8 and beyond)",
      "Understand closures, prototypes, lexical scoping, and 'this'",
      "Manipulate the DOM dynamically and handle complex user events",
      "Work with Promises, Async/Await, and REST API integrations",
      "Build modular, production-ready frontend web components",
    ],
    includes: [
      { icon: "icofont-play", label: "28 Hours Video" },
      { icon: "icofont-certificate-alt-1", label: "Certificate" },
      { icon: "icofont-file-alt", label: "12 Article" },
      { icon: "icofont-video-cam", label: "Watch Offline" },
      { icon: "icofont-clock-time", label: "Life Time Access" },
      { icon: "icofont-dollar", label: "Paid" },
    ],
    curriculum: [
      {
        id: "mod-1",
        title: "Module 1: Introduction to JavaScript & Tooling",
        duration: "3h 15m",
        lectures: [
          { id: "lec-1", title: "Course Introduction & Setup", duration: "12m", isFreePreview: true },
          { id: "lec-2", title: "Variables: var, let, and const in Detail", duration: "25m", isFreePreview: true },
          { id: "lec-3", title: "Primitive vs Reference Data Types", duration: "40m" },
          { id: "lec-4", title: "Arithmetic and Logical Operators", duration: "35m" },
        ],
      },
      {
        id: "mod-2",
        title: "Module 2: Control Flow & Functions",
        duration: "5h 40m",
        lectures: [
          { id: "lec-5", title: "Conditional Statements & Ternary Syntax", duration: "30m" },
          { id: "lec-6", title: "Loops: for, while, and modern iterators", duration: "45m" },
          { id: "lec-7", title: "Arrow Functions and Lexical Scoping", duration: "50m", isFreePreview: true },
          { id: "lec-8", title: "High-Order Functions: map, filter, reduce", duration: "65m" },
        ],
      },
      {
        id: "mod-3",
        title: "Module 3: The DOM & Browser Events",
        duration: "7h 10m",
        lectures: [
          { id: "lec-9", title: "Selecting & Manipulating DOM Elements", duration: "45m" },
          { id: "lec-10", title: "Event Listeners & Event Delegation", duration: "55m" },
          { id: "lec-11", title: "Building an Interactive Task Manager App", duration: "85m" },
        ],
      },
      {
        id: "mod-4",
        title: "Module 4: Asynchronous JavaScript & REST APIs",
        duration: "8h 30m",
        lectures: [
          { id: "lec-12", title: "Event Loop, Callbacks & Microtasks", duration: "45m" },
          { id: "lec-13", title: "Promises & Error Handling with Catch", duration: "50m" },
          { id: "lec-14", title: "Async/Await with Fetch API", duration: "60m" },
          { id: "lec-15", title: "Capstone Project: Live Weather Dashboard", duration: "95m" },
        ],
      },
    ],
    ratingsBreakdown: {
      totalRating: 4.2,
      distribution: [
        { star: 5, percentage: 78, key: "ht" },
        { star: 4, percentage: 60, key: "sk" },
        { star: 3, percentage: 45, key: "ph" },
        { star: 2, percentage: 15, key: "il" },
        { star: 1, percentage: 1, key: "in" },
      ],
    },
    reviews: [
      {
        id: "rev-1",
        author: "willimes doe",
        date: "12 june 2024",
        rating: 4.5,
        avatar: "/images/resources/commenter-1.jpg",
        comment:
          "Quis autem velum iure reprehe nderit. Lorem ipsum dolor sit amet adipiscing egetmassa pulvinar eu aliquet nibh dapibus. The exercises are wonderfully clear.",
      },
      {
        id: "rev-2",
        author: "Qlark Jack",
        date: "22 july 2024",
        rating: 4.5,
        avatar: "/images/resources/commenter-2.jpg",
        comment:
          "Quis autem velum iure reprehe nderit. Lorem ipsum dolor sit amet adipiscing egetmassa pulvinar eu aliquet nibh dapibus. Highly recommend for any junior dev!",
      },
      {
        id: "rev-3",
        author: "Olivia Take",
        date: "15 jan 2024",
        rating: 4.5,
        avatar: "/images/resources/commenter-3.jpg",
        comment:
          "Quis autem velum iure reprehe nderit. Lorem ipsum dolor sit amet adipiscing egetmassa pulvinar eu aliquet nibh dapibus.",
      },
    ],
    relatedCourses: [
      {
        id: "html5-brick-breaker",
        title: "Html5 Brick Breaker",
        img: "/images/resources/course-2.png",
        price: 29,
        instructor: "Tania Saed",
      },
      {
        id: "pure-css-tutorials",
        title: "Pure Css Tutorials",
        img: "/images/resources/course-1.jpg",
        price: 19,
        instructor: "Ahmad",
      },
      {
        id: "basic-angular",
        title: "Basic Angular",
        img: "/images/resources/course-3.jpg",
        price: 35,
        instructor: "Fahad Jhon",
      },
      {
        id: "advance-css3",
        title: "Advance Css3",
        img: "/images/resources/course-4.jpg",
        price: 39,
        instructor: "Andrew",
      },
      {
        id: "wordpress-advanced",
        title: "Wordpress Advance",
        img: "/images/resources/course-5.jpg",
        price: 29,
        instructor: "Sarah K",
      },
    ],
  },
  {
    id: "wordpress-advanced",
    title: "Wordpress Advanced Development & Custom Themes",
    category: "HTML5",
    price: 29.0,
    oldPrice: 49.0,
    rating: 4.7,
    views: 2180,
    likes: 310,
    dislikes: 12,
    instructor: {
      name: "Sarah K",
      avatar: "/images/resources/user1.jpg",
      lastUpdate: "Sep, 10 2024",
      bio: "WordPress Core Contributor, Full-Stack PHP & Gutenberg Blocks Engineer.",
      followersCount: 5120,
    },
    videoPreview: {
      url: "https://www.youtube.com/embed/nOCXXHGMezU",
      thumbnail: "/images/resources/course-5.jpg",
    },
    description:
      "Learn modern WordPress development from scratch. Build bespoke custom themes, Gutenberg blocks, custom REST API endpoints, and high-performance e-commerce integrations.",
    extendedDescription:
      "This course walks you through building WordPress websites like a professional software engineer. You will build custom block themes with JSON theme.json definitions, craft React-powered Gutenberg blocks, optimize database queries, and secure your deployments.",
    whatYouWillLearn: [
      "Custom WordPress theme development from scratch",
      "Modern React Gutenberg block creation",
      "Advanced Custom Fields (ACF) Pro integration",
      "Headless WordPress with Next.js and WPGraphQL",
      "Database caching and Redis speed optimization",
    ],
    includes: [
      { icon: "icofont-play", label: "20 Hours Video" },
      { icon: "icofont-certificate-alt-1", label: "Certificate" },
      { icon: "icofont-file-alt", label: "24 Articles" },
      { icon: "icofont-video-cam", label: "Watch Offline" },
      { icon: "icofont-clock-time", label: "Life Time Access" },
      { icon: "icofont-dollar", label: "Paid" },
    ],
    curriculum: [
      {
        id: "wp-1",
        title: "Theme Architecture & Template Hierarchy",
        duration: "4h 00m",
        lectures: [
          { id: "wp-lec-1", title: "WordPress Core Architecture", duration: "25m", isFreePreview: true },
          { id: "wp-lec-2", title: "Building the Root Theme Files", duration: "45m" },
        ],
      },
      {
        id: "wp-2",
        title: "Custom Gutenberg Blocks with React",
        duration: "6h 30m",
        lectures: [
          { id: "wp-lec-3", title: "Block API & Attributes", duration: "40m" },
          { id: "wp-lec-4", title: "Block Controls & Inspector", duration: "50m" },
        ],
      },
    ],
    ratingsBreakdown: {
      totalRating: 4.7,
      distribution: [
        { star: 5, percentage: 85, key: "ht" },
        { star: 4, percentage: 55, key: "sk" },
        { star: 3, percentage: 20, key: "ph" },
        { star: 2, percentage: 5, key: "il" },
        { star: 1, percentage: 2, key: "in" },
      ],
    },
    reviews: [
      {
        id: "rev-wp-1",
        author: "Jack Carter",
        date: "04 August 2024",
        rating: 5,
        avatar: "/images/resources/user5.jpg",
        comment: "The absolute best WordPress theme development course on the market!",
      },
    ],
    relatedCourses: [
      {
        id: "learn-basic-javascript",
        title: "Learn Basic Java Scripts",
        img: "/images/resources/course-2.jpg",
        price: 19.99,
        instructor: "Kim Carter",
      },
      {
        id: "advance-css3",
        title: "Advance Css3",
        img: "/images/resources/course-4.jpg",
        price: 39,
        instructor: "Andrew",
      },
    ],
  },
  {
    id: "html5-advanced-lectures",
    title: "HTML5 Advanced Lectures & Semantic Architecture",
    category: "HTML5",
    price: 29.0,
    oldPrice: 39.0,
    rating: 4.6,
    views: 1840,
    likes: 240,
    dislikes: 18,
    instructor: {
      name: "Tania Saed",
      avatar: "/images/resources/user2.jpg",
      lastUpdate: "Jul, 15 2024",
      bio: "Accessibility Specialist & Web Standards Pioneer.",
      followersCount: 2980,
    },
    videoPreview: {
      url: "https://www.youtube.com/embed/nOCXXHGMezU",
      thumbnail: "/images/resources/course-2.png",
    },
    description:
      "Deep dive into semantic HTML5, modern Web APIs, canvas 2D rendering, audio/video pipelines, and building accessible WCAG 2.2 compliant websites.",
    extendedDescription:
      "Clean HTML is the foundation of high-ranking, fast-loading, and fully accessible web experiences. This course teaches advanced document structure, SEO best practices, microdata, and offline storage.",
    whatYouWillLearn: [
      "Semantic HTML5 hierarchy and ARIA roles",
      "HTML5 Canvas 2D game rendering basics",
      "Web Audio and Video media integration",
      "IndexedDB and service workers for offline web apps",
    ],
    includes: [
      { icon: "icofont-play", label: "30 Hours Video" },
      { icon: "icofont-certificate-alt-1", label: "Certificate" },
      { icon: "icofont-file-alt", label: "18 Articles" },
      { icon: "icofont-video-cam", label: "Watch Offline" },
      { icon: "icofont-clock-time", label: "Life Time Access" },
      { icon: "icofont-dollar", label: "Paid" },
    ],
    curriculum: [
      {
        id: "h5-1",
        title: "Semantic Markup & Accessibility",
        duration: "5h 15m",
        lectures: [
          { id: "h5-lec-1", title: "HTML5 Document Models", duration: "30m", isFreePreview: true },
          { id: "h5-lec-2", title: "ARIA Landmarks and Screen Readers", duration: "45m" },
        ],
      },
    ],
    ratingsBreakdown: {
      totalRating: 4.6,
      distribution: [
        { star: 5, percentage: 80, key: "ht" },
        { star: 4, percentage: 65, key: "sk" },
        { star: 3, percentage: 30, key: "ph" },
        { star: 2, percentage: 10, key: "il" },
        { star: 1, percentage: 1, key: "in" },
      ],
    },
    reviews: [
      {
        id: "rev-h5-1",
        author: "Fawad Khan",
        date: "18 June 2024",
        rating: 4.8,
        avatar: "/images/resources/user3.jpg",
        comment: "Excellent lectures on semantic tags and accessibility compliance.",
      },
    ],
    relatedCourses: [
      {
        id: "pure-css-tutorials",
        title: "Pure Css Tutorials",
        img: "/images/resources/course-1.jpg",
        price: 19,
        instructor: "Ahmad",
      },
      {
        id: "advance-css3",
        title: "Advance Css3",
        img: "/images/resources/course-4.jpg",
        price: 39,
        instructor: "Andrew",
      },
    ],
  },
  {
    id: "css3-full-video-lectures",
    title: "CSS3 Full Video Lectures & Modern Layouts",
    category: "HTML5",
    price: 39.0,
    oldPrice: 59.0,
    rating: 4.8,
    views: 3100,
    likes: 420,
    dislikes: 15,
    instructor: {
      name: "Andrew",
      avatar: "/images/resources/userlist-1.jpg",
      lastUpdate: "May, 20 2024",
      bio: "Lead UI Architect and CSS Animation Artist.",
      followersCount: 6200,
    },
    videoPreview: {
      url: "https://www.youtube.com/embed/nOCXXHGMezU",
      thumbnail: "/images/resources/course-4.jpg",
    },
    description:
      "Master CSS Flexbox, Grid, CSS Variables, subgrid, container queries, 3D transforms, and performance-optimized micro-animations for enterprise web applications.",
    extendedDescription:
      "Take complete control of modern web styling. Learn responsive design without media query overload using CSS clamp(), grid auto-fit/auto-fill, and hardware-accelerated animations.",
    whatYouWillLearn: [
      "Master modern CSS Grid and Flexbox layouts",
      "Container queries and fluid typography clamp()",
      "Hardware-accelerated CSS animations and transitions",
      "BEM naming conventions and scalable CSS design systems",
    ],
    includes: [
      { icon: "icofont-play", label: "30 Hours Video" },
      { icon: "icofont-certificate-alt-1", label: "Certificate" },
      { icon: "icofont-file-alt", label: "15 Articles" },
      { icon: "icofont-video-cam", label: "Watch Offline" },
      { icon: "icofont-clock-time", label: "Life Time Access" },
      { icon: "icofont-dollar", label: "Paid" },
    ],
    curriculum: [
      {
        id: "css-1",
        title: "Flexbox and CSS Grid Masterclass",
        duration: "8h 00m",
        lectures: [
          { id: "css-lec-1", title: "Flexbox Layout Mechanics", duration: "45m", isFreePreview: true },
          { id: "css-lec-2", title: "Two-Dimensional Grid Systems", duration: "60m" },
        ],
      },
    ],
    ratingsBreakdown: {
      totalRating: 4.8,
      distribution: [
        { star: 5, percentage: 90, key: "ht" },
        { star: 4, percentage: 70, key: "sk" },
        { star: 3, percentage: 15, key: "ph" },
        { star: 2, percentage: 4, key: "il" },
        { star: 1, percentage: 1, key: "in" },
      ],
    },
    reviews: [
      {
        id: "rev-css-1",
        author: "Danial Sandos",
        date: "25 May 2024",
        rating: 5,
        avatar: "/images/resources/user4.jpg",
        comment: "Completely transformed how I think about responsive layouts!",
      },
    ],
    relatedCourses: [
      {
        id: "html5-advanced-lectures",
        title: "HTML5 Advanced Lectures",
        img: "/images/resources/course-2.png",
        price: 29,
        instructor: "Tania Saed",
      },
      {
        id: "learn-basic-javascript",
        title: "Learn Basic Java Scripts",
        img: "/images/resources/course-2.jpg",
        price: 19.99,
        instructor: "Kim Carter",
      },
    ],
  },
  {
    id: "vujs-first-learning",
    title: "Vue.js First Learning: Composition API & Pinia",
    category: "HTML5",
    price: 49.0,
    oldPrice: 69.0,
    rating: 4.9,
    views: 2900,
    likes: 380,
    dislikes: 10,
    instructor: {
      name: "Bob-Frank",
      avatar: "/images/resources/user4.jpg",
      lastUpdate: "Sep, 01 2024",
      bio: "Vue & Nuxt Specialist, Open Source Contributor.",
      followersCount: 4890,
    },
    videoPreview: {
      url: "https://www.youtube.com/embed/nOCXXHGMezU",
      thumbnail: "/images/resources/course-6.jpg",
    },
    description:
      "From zero to production with Vue 3. Master the Composition API, script setup syntax, Pinia state store, Vue Router 4, and TypeScript integration.",
    extendedDescription:
      "A pragmatic course designed for frontend engineers looking to adopt Vue 3. Build reactive single-page applications with clean composables and automated Vitest suites.",
    whatYouWillLearn: [
      "Vue 3 Composition API and reactivity system",
      "Modern Pinia state management",
      "Vue Router 4 guards and dynamic route parameters",
      "Unit testing with Vitest and Vue Test Utils",
    ],
    includes: [
      { icon: "icofont-play", label: "30 Hours Video" },
      { icon: "icofont-certificate-alt-1", label: "Certificate" },
      { icon: "icofont-file-alt", label: "20 Articles" },
      { icon: "icofont-video-cam", label: "Watch Offline" },
      { icon: "icofont-clock-time", label: "Life Time Access" },
      { icon: "icofont-dollar", label: "Paid" },
    ],
    curriculum: [
      {
        id: "vue-1",
        title: "Composition API Fundamentals",
        duration: "6h 00m",
        lectures: [
          { id: "vue-lec-1", title: "Reactivity with ref and reactive", duration: "35m", isFreePreview: true },
          { id: "vue-lec-2", title: "Custom Composables Design", duration: "55m" },
        ],
      },
    ],
    ratingsBreakdown: {
      totalRating: 4.9,
      distribution: [
        { star: 5, percentage: 92, key: "ht" },
        { star: 4, percentage: 75, key: "sk" },
        { star: 3, percentage: 10, key: "ph" },
        { star: 2, percentage: 2, key: "il" },
        { star: 1, percentage: 1, key: "in" },
      ],
    },
    reviews: [
      {
        id: "rev-vue-1",
        author: "Maria K",
        date: "02 Sep 2024",
        rating: 5,
        avatar: "/images/resources/user2.jpg",
        comment: "Clear, concise, and straight to the point. Perfect guide to modern Vue 3.",
      },
    ],
    relatedCourses: [
      {
        id: "learn-basic-javascript",
        title: "Learn Basic Java Scripts",
        img: "/images/resources/course-2.jpg",
        price: 19.99,
        instructor: "Kim Carter",
      },
    ],
  },
];

export function findCourseItem(idOrSlug?: string | null): CourseItem {
  if (!idOrSlug) return COURSES_CATALOG[0];

  const query = idOrSlug.trim().toLowerCase();

  const exactMatch = COURSES_CATALOG.find(
    (c) => c.id.toLowerCase() === query || c.title.toLowerCase() === query
  );
  if (exactMatch) return exactMatch;

  const partialMatch = COURSES_CATALOG.find(
    (c) =>
      c.id.toLowerCase().includes(query) ||
      query.includes(c.id.toLowerCase()) ||
      c.title.toLowerCase().includes(query) ||
      query.includes(c.title.toLowerCase())
  );
  if (partialMatch) return partialMatch;

  return COURSES_CATALOG[0];
}
