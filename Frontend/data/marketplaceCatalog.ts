export type ReviewItem = {
  id: string;
  author: string;
  date: string;
  rating: number;
  avatar: string;
  comment: string;
};

export type CatalogItem = {
  id: string;
  type: "book" | "product";
  name: string;
  tag?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  visited: number;
  downloads: string;
  availability: string;
  img: string;
  author: string;
  authorRole?: string;
  pages?: string;
  publishDate?: string;
  barcode?: string;
  publisher?: string;
  category?: string;
  description: string;
  extendedDescription?: string;
  chapters?: string[];
  specs?: { label: string; value: string }[];
  sampleText?: string;
  reviews: ReviewItem[];
};

export const CATALOG_BOOKS: CatalogItem[] = [
  {
    id: "python-tricks",
    type: "book",
    name: "Python Tricks 2024: Design Patterns & Architecture",
    tag: "Trending",
    price: 20.0,
    oldPrice: 35.0,
    rating: 4.8,
    reviewsCount: 42,
    visited: 130,
    downloads: "1.3k",
    availability: "Available (Instant eBook & Hardcover)",
    img: "/images/resources/book3.jpg",
    author: "Jhon Doe",
    authorRole: "Principal Systems Architect & Author",
    pages: "1,120 pages",
    publishDate: "Aug 05, 2024",
    barcode: "9780099511021",
    publisher: "Random House Academic Press",
    category: "Software Engineering & Computer Science",
    description:
      "A comprehensive, hands-on masterclass in modern Pythonic code. Master asynchronous design patterns, idiomatic data modeling, performance optimizations, and production architecture.",
    extendedDescription:
      "Python Tricks 2024 is written for engineers, students, and data researchers who want to write cleaner, more resilient, and high-performance Python code. Packed with over 150 actionable recipes, this volume walks you through generator pipelines, decorator metaprogramming, modern concurrency with AsyncIO, strict type checking with Pydantic and Mypy, and rock-solid test architectures.",
    chapters: [
      "Chapter 1: Writing Clean & Idiomatic Python 3.12+",
      "Chapter 2: Data Structures, Collections & Memory Optimizations",
      "Chapter 3: Object-Oriented Patterns, Protocols & Metaclasses",
      "Chapter 4: AsyncIO, Concurrency & High-Throughput Microservices",
      "Chapter 5: Architectural Testing, Packaging & Production Deployment",
    ],
    sampleText:
      "Tip #1: Embrace Comprehensions and Generator Expressions for Lean Memory Footprints.\n\nIn high-throughput services, instantiating large lists in memory introduces unnecessary GC overhead. Using generator expressions allows lazy streaming evaluation, turning O(N) memory consumption into an O(1) constant footprint while retaining clean, expressive syntax.",
    reviews: [
      {
        id: "r-1",
        author: "Willimes Doe",
        date: "12 June 2024",
        rating: 5,
        avatar: "/images/resources/commenter-1.jpg",
        comment:
          "An indispensable handbook for any engineer working in Python daily. The chapter on concurrency and memory optimization alone saved our team dozens of hours!",
      },
      {
        id: "r-2",
        author: "Qlark Jack",
        date: "22 July 2024",
        rating: 4.5,
        avatar: "/images/resources/commenter-2.jpg",
        comment:
          "Extremely well organized, clear code snippets, and zero fluff. Highly recommend both the physical hardcover and the digital PDF.",
      },
      {
        id: "r-3",
        author: "Olivia Take",
        date: "15 August 2024",
        rating: 5,
        avatar: "/images/resources/commenter-3.jpg",
        comment:
          "The best Python publication of the year. Essential reading for graduate researchers and senior engineers alike.",
      },
    ],
  },
  {
    id: "html5-brick-breaker",
    type: "book",
    name: "Html5 Brick Breaker & Canvas Physics",
    tag: "Popular",
    price: 29.99,
    oldPrice: 42.0,
    rating: 4.7,
    reviewsCount: 28,
    visited: 95,
    downloads: "940",
    availability: "Available",
    img: "/images/resources/book1.jpg",
    author: "Alex Rivera",
    authorRole: "Graphics Engineer & Creative Technologist",
    pages: "480 pages",
    publishDate: "Jan 14, 2024",
    barcode: "9780099511038",
    publisher: "Socimo Creative Press",
    category: "Game Development & HTML5",
    description:
      "Deep dive into 2D canvas rendering, physics engines, collision algorithms, and interactive game loop architectures in modern browsers.",
    extendedDescription:
      "Learn how to build hardware-accelerated 2D web arcade games and physics simulators from scratch using raw TypeScript and the HTML5 Canvas API.",
    chapters: [
      "Chapter 1: The RequestAnimationFrame Game Loop",
      "Chapter 2: Vector Mathematics & Continuous Collision Detection",
      "Chapter 3: Particle Systems, Audio FX & Screen Shake",
      "Chapter 4: Asset Pipelines & WebGL Shader Acceleration",
    ],
    reviews: [
      {
        id: "r-b1",
        author: "Marcus Vance",
        date: "04 May 2024",
        rating: 5,
        avatar: "/images/resources/commenter-2.jpg",
        comment: "Brilliant step-by-step breakdown of collision maths and canvas optimization!",
      },
    ],
  },
  {
    id: "aesthetic-ideology",
    type: "book",
    name: "The Aesthetic Ideology & Modern Digital Interfaces",
    tag: "Featured",
    price: 24.5,
    oldPrice: 38.0,
    rating: 4.9,
    reviewsCount: 35,
    visited: 110,
    downloads: "1.1k",
    availability: "Available",
    img: "/images/resources/book2.jpg",
    author: "Sophia Chen",
    authorRole: "Design Director & HCI Researcher",
    pages: "620 pages",
    publishDate: "Mar 10, 2024",
    barcode: "9780099511045",
    publisher: "Cambridge Media Group",
    category: "UI/UX & Human-Computer Interaction",
    description:
      "An insightful exploration of visual balance, typography hierarchy, cognitive load, and human-centered design principles for contemporary applications.",
    extendedDescription:
      "Bridging the gap between philosophy of art and digital user experience design, this book analyzes what makes user interfaces feel truly intuitive and emotionally resonant.",
    chapters: [
      "Chapter 1: The Cognitive Psychology of Modern Layouts",
      "Chapter 2: Micro-Interactions & Motion Choreography",
      "Chapter 3: Spatial Design & Color Harmony",
      "Chapter 4: Accessibility as an Aesthetic Core",
    ],
    reviews: [],
  },
  {
    id: "technology-wants",
    type: "book",
    name: "Technology Wants: Artificial Intelligence & Society",
    tag: "Bestseller",
    price: 34.0,
    oldPrice: 48.0,
    rating: 4.8,
    reviewsCount: 52,
    visited: 210,
    downloads: "2.4k",
    availability: "Available",
    img: "/images/resources/book5.jpg",
    author: "Richard Ali",
    authorRole: "Tech Columnist & AI Ethicist",
    pages: "750 pages",
    publishDate: "Feb 20, 2024",
    barcode: "9780099511052",
    publisher: "Random House Academic",
    category: "Artificial Intelligence & Ethics",
    description:
      "A provocative analysis of technological evolution, machine agency, generative intelligence, and human flourishing in the algorithmic age.",
    extendedDescription:
      "Richard Ali examines the accelerating trajectory of frontier models, synthetic media, and autonomous agents, asking crucial questions about the social contract.",
    chapters: [
      "Chapter 1: The Trajectory of Machine Cognition",
      "Chapter 2: Cultural Feedback Loops in Generative AI",
      "Chapter 3: Decentralized Knowledge & Academic Sovereignty",
      "Chapter 4: Governance for Frontier Systems",
    ],
    reviews: [],
  },
];

export const CATALOG_PRODUCTS: CatalogItem[] = [
  {
    id: "p-1",
    type: "product",
    name: "Technical Words 2024 Research World",
    tag: "Academic",
    price: 39.0,
    oldPrice: 55.0,
    rating: 5.0,
    reviewsCount: 38,
    visited: 180,
    downloads: "1.5k",
    availability: "In Stock (Digital & Print)",
    img: "/images/resources/book5.jpg",
    author: "Georg Peeter",
    authorRole: "Senior Researcher, Oxford Institute",
    category: "Books",
    description:
      "The definitive reference compendium for academic research terminology, publication protocols, paper structuring, and scientific citation standards.",
    extendedDescription:
      "Essential desk reference for researchers, faculty members, and thesis students across disciplines. Includes exhaustive terminology, LaTeX templates, peer-review strategies, and journal submission checklists.",
    specs: [
      { label: "Edition", value: "2024 Hardcover Revised" },
      { label: "Language", value: "English" },
      { label: "Pages", value: "890 Pages" },
      { label: "Publisher", value: "Socimo Academic Press" },
      { label: "Format", value: "Hardcover, PDF, ePub" },
    ],
    reviews: [
      {
        id: "rp-1",
        author: "Dr. Elena Rostova",
        date: "14 July 2024",
        rating: 5,
        avatar: "/images/resources/commenter-1.jpg",
        comment: "The most practical handbook for structuring academic journal papers I have encountered in my 15-year career.",
      },
    ],
  },
  {
    id: "p-2",
    type: "product",
    name: "Complete Python Data Science & AI Bootcamp",
    tag: "Top Rated",
    price: 89.0,
    oldPrice: 149.0,
    rating: 4.9,
    reviewsCount: 64,
    visited: 340,
    downloads: "3.8k",
    availability: "Instant Access (62 Hours On-Demand)",
    img: "/images/resources/course-1.jpg",
    author: "Dr. Amy Watson",
    authorRole: "Lead Data Scientist & Stanford Lecturer",
    category: "Courses",
    description:
      "Comprehensive masterclass covering Python, NumPy, Pandas, Data Visualization, Scikit-Learn, PyTorch, and generative AI model training.",
    extendedDescription:
      "Take your skills from fundamental data wrangling to deep learning transformers. Features 24 real-world projects, interactive Jupyter notebooks, and certificate of completion.",
    specs: [
      { label: "Course Length", value: "62 Hours of Video" },
      { label: "Projects", value: "24 Hands-on Projects" },
      { label: "Level", value: "Beginner to Advanced" },
      { label: "Access", value: "Lifetime Full Access" },
      { label: "Certificate", value: "Included" },
    ],
    reviews: [
      {
        id: "rp-2",
        author: "Kevin Miller",
        date: "28 June 2024",
        rating: 5,
        avatar: "/images/resources/commenter-3.jpg",
        comment: "Helped me transition directly from junior analyst to machine learning engineer. Super clear explanations!",
      },
    ],
  },
  {
    id: "p-3",
    type: "product",
    name: "Pro Research Laptop & Workstation Kit",
    tag: "High Tech",
    price: 499.0,
    oldPrice: 650.0,
    rating: 4.8,
    reviewsCount: 22,
    visited: 420,
    downloads: "210",
    availability: "In Stock (Free Express Shipping)",
    img: "/images/resources/laptop.png",
    author: "Socimo Hardware Lab",
    authorRole: "Hardware & Computing Engineering",
    category: "Electronics",
    description:
      "Ultra-portable, high-efficiency compute laptop kit optimized for scientific programming, data compilation, and heavy simulation workflows.",
    extendedDescription:
      "Engineered with a high-resolution 120Hz anti-glare display, 32GB high-speed memory, dual NVMe PCIe 4.0 storage, and all-day battery life for researchers on the move.",
    specs: [
      { label: "Processor", value: "12-Core 4.8GHz Max Boost" },
      { label: "Memory", value: "32GB LPDDR5X" },
      { label: "Storage", value: "1TB PCIe Gen4 NVMe SSD" },
      { label: "Display", value: "14.2\" 2.8K 120Hz IPS" },
      { label: "Weight", value: "1.34 kg" },
    ],
    reviews: [],
  },
  {
    id: "p-6",
    type: "product",
    name: "Wireless Active Noise-Cancelling Headphones",
    tag: "Best Value",
    price: 79.0,
    oldPrice: 120.0,
    rating: 4.6,
    reviewsCount: 19,
    visited: 290,
    downloads: "540",
    availability: "In Stock",
    img: "/images/resources/sponsor-prod1.jpg",
    author: "AudioCraft Studio",
    authorRole: "Acoustic Engineering",
    category: "Accessories",
    description:
      "Audiophile-grade 40mm drivers with hybrid active noise cancellation designed for deep focus in libraries and campus study halls.",
    extendedDescription:
      "Enjoy 45 hours of continuous playback with rapid USB-C charging, ultra-soft memory foam earcups, and dual beamforming microphones for crystal-clear seminar audio.",
    specs: [
      { label: "Battery Life", value: "Up to 45 Hours" },
      { label: "ANC", value: "Hybrid Active Noise Cancellation" },
      { label: "Connectivity", value: "Bluetooth 5.3 & 3.5mm Aux" },
      { label: "Charge Time", value: "15 min charge = 6 hours playback" },
    ],
    reviews: [],
  },
  {
    id: "p-7",
    type: "product",
    name: "Socimo Premium Researcher Hoodie",
    tag: "Apparel",
    price: 45.0,
    oldPrice: 60.0,
    rating: 4.9,
    reviewsCount: 31,
    visited: 310,
    downloads: "680",
    availability: "In Stock (All Sizes)",
    img: "/images/resources/sponsor-prod2.jpg",
    author: "Socimo Apparel Co.",
    authorRole: "Fashion & Lifestyle",
    category: "Apparel",
    description:
      "Ultra-soft, heavyweight 420 GSM organic cotton hoodie with brushed fleece lining and subtle embroidered Socimo academic logo.",
    extendedDescription:
      "Crafted for late nights in the lab and chilly morning lectures. Features reinforced stitching, a double-lined hood, and a hidden interior media pocket.",
    specs: [
      { label: "Material", value: "100% Organic French Terry Cotton" },
      { label: "Weight", value: "420 GSM Heavyweight" },
      { label: "Fit", value: "Modern Relaxed Fit" },
      { label: "Care", value: "Machine wash cold, tumble dry low" },
    ],
    reviews: [],
  },
];

export const POPULAR_SIDEBAR_BOOKS = [
  {
    id: "vue-basics",
    title: "Vu.js 2 & 3 Basics",
    author: "Richard Ali",
    img: "/images/resources/book10.jpg",
    href: "/book-detail?id=vue-basics",
  },
  {
    id: "css3-beginners",
    title: "Css3 for Beginners",
    author: "Richard Ali",
    img: "/images/resources/book9.jpg",
    href: "/book-detail?id=css3-beginners",
  },
  {
    id: "technology-wants",
    title: "Technology Wants 2024",
    author: "Richard Ali",
    img: "/images/resources/book5.jpg",
    href: "/book-detail?id=technology-wants",
  },
];

export const UPCOMING_EVENTS = [
  {
    title: "BZ University Tech & AI Summit in Columbia",
    category: "Campus Event",
    bgClass: "bg-purple",
    icon: "icofont-gift",
    date: "Sep 24, 2026",
  },
  {
    title: "The 3rd International Research Conference",
    category: "Academic Conference",
    bgClass: "bg-blue",
    icon: "icofont-microphone",
    date: "Oct 12, 2026",
  },
];

export const WHOS_FOLLOWING = [
  { name: "Kelly Bill", role: "Dept colleague", img: "/images/resources/friend-avatar.jpg", following: false },
  { name: "Issabel", role: "Research Assistant", img: "/images/resources/friend-avatar2.jpg", following: true },
  { name: "Andrew", role: "Computer Science Dept", img: "/images/resources/friend-avatar3.jpg", following: false },
  { name: "Sophia", role: "HCI Fellow", img: "/images/resources/friend-avatar4.jpg", following: false },
  { name: "Allen", role: "Dept colleague", img: "/images/resources/friend-avatar5.jpg", following: true },
];

export function findCatalogItem(idOrSlug: string, defaultType: "book" | "product" = "book"): CatalogItem {
  const all = [...CATALOG_BOOKS, ...CATALOG_PRODUCTS];
  const found = all.find(
    (item) => item.id.toLowerCase() === idOrSlug.toLowerCase() || item.name.toLowerCase().includes(idOrSlug.toLowerCase())
  );
  if (found) return found;

  return defaultType === "book" ? CATALOG_BOOKS[0] : CATALOG_PRODUCTS[0];
}
