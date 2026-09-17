"use client";

export type PageItem = {
  id: string;
  name: string;
  handle: string;
  category: "Research Labs" | "Universities" | "Tech Companies" | "Scientific Journals" | "Open Source";
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  followersCount: number;
  postsCount: number;
  isFollowing?: boolean;
  verified?: boolean;
  featuredPost?: {
    title: string;
    date: string;
    snippet: string;
  };
};

export const INITIAL_PAGES: PageItem[] = [
  {
    id: "pg-1",
    name: "MIT CSAIL Robotics & AI",
    handle: "@mit_csail_robotics",
    category: "Research Labs",
    avatar: "/images/resources/user-pic1.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "Computer Science and Artificial Intelligence Laboratory at MIT. Pioneering autonomous systems, deep reinforcement learning, embodied AI, and soft robotics.",
    location: "Cambridge, MA, USA",
    website: "https://csail.mit.edu",
    followersCount: 142800,
    postsCount: 1420,
    isFollowing: true,
    verified: true,
    featuredPost: {
      title: "Real-Time Diffusion Policy for Quadruped Locomotion on Unstructured Terrain",
      date: "2 days ago",
      snippet: "Our latest preprint demonstrates zero-shot sim-to-real transfer of agile climbing policies on loose gravel and slippery ice.",
    },
  },
  {
    id: "pg-2",
    name: "CERN Particle Physics Directorate",
    handle: "@cern_official",
    category: "Research Labs",
    avatar: "/images/resources/user-pic2.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "European Organization for Nuclear Research. Probing fundamental particle interactions, Higgs precision measurements, and High-Luminosity LHC upgrades.",
    location: "Geneva, Switzerland",
    website: "https://home.cern",
    followersCount: 195000,
    postsCount: 3800,
    isFollowing: false,
    verified: true,
    featuredPost: {
      title: "New Upper Bounds on Rare B-Meson Lepton Flavor Universality Tests",
      date: "Yesterday",
      snippet: "ATLAS and CMS complete combined analysis on 13.6 TeV collision dataset, tightening limits on leptoquark candidates.",
    },
  },
  {
    id: "pg-3",
    name: "Stanford University School of Engineering",
    handle: "@stanford_engineering",
    category: "Universities",
    avatar: "/images/resources/user-pic3.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "Innovating across biological engineering, applied physics, materials science, and human-centered artificial intelligence.",
    location: "Stanford, CA, USA",
    website: "https://engineering.stanford.edu",
    followersCount: 128400,
    postsCount: 2200,
    isFollowing: true,
    verified: true,
    featuredPost: {
      title: "Fall 2026 Distinguished Lecture Series in Quantum Computing & Photonics",
      date: "Sep 10, 2026",
      snippet: "Open campus lectures featuring guest keynotes from pioneers in topological qubits and optical neural networks.",
    },
  },
  {
    id: "pg-4",
    name: "DeepMind AlphaFold & Biomolecular Systems",
    handle: "@deepmind_bio",
    category: "Tech Companies",
    avatar: "/images/resources/user-pic4.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "Applying advanced deep neural architectures to macromolecular structural biology, ligand docking, and novel enzyme generation.",
    location: "London, UK",
    website: "https://deepmind.google/technologies/alphafold",
    followersCount: 164000,
    postsCount: 940,
    isFollowing: false,
    verified: true,
    featuredPost: {
      title: "AlphaFold 3 Multimer Complexes Validated on Cryo-EM Crystal Datasets",
      date: "3 days ago",
      snippet: "High-accuracy predictions for RNA-protein complexes and covalent drug candidates now available to the academic community.",
    },
  },
  {
    id: "pg-5",
    name: "Journal of Open Source Software & Science (JOSS)",
    handle: "@joss_journal",
    category: "Scientific Journals",
    avatar: "/images/resources/user-pic5.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "Gold open-access journal dedicated to peer-reviewing and archiving computational research software and reproducibility tooling.",
    location: "Global / Decentralized",
    website: "https://joss.theoj.org",
    followersCount: 48900,
    postsCount: 4120,
    isFollowing: false,
    verified: true,
    featuredPost: {
      title: "Announcing FastTrack Peer-Review Guidelines for Scientific Python 2.0 Libraries",
      date: "Sep 12, 2026",
      snippet: "Streamlining the submission and artifact evaluation pipeline for high-performance computing numerical libraries.",
    },
  },
  {
    id: "pg-6",
    name: "Hugging Face Open Science Initiative",
    handle: "@huggingface_science",
    category: "Open Source",
    avatar: "/images/resources/user-pic6.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "The AI community building the future. Democratizing open-weights models, open datasets, and reproducible scientific benchmarks.",
    location: "New York & Paris",
    website: "https://huggingface.co",
    followersCount: 221000,
    postsCount: 5180,
    isFollowing: true,
    verified: true,
    featuredPost: {
      title: "100K+ Open Chemistry and Molecular Graph Datasets Live on the Hub",
      date: "Sep 15, 2026",
      snippet: "Community members can now fine-tune graph neural networks directly with automated WebGL molecular visualization.",
    },
  },
  {
    id: "pg-7",
    name: "Oxford Centre for Tropical Medicine & Global Health",
    handle: "@oxford_tropicalmed",
    category: "Universities",
    avatar: "/images/resources/user-pic7.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "Conducting clinical trials, epidemiology research, and vaccine development across collaborative health units worldwide.",
    location: "Oxford, UK",
    website: "https://www.tropicalmedicine.ox.ac.uk",
    followersCount: 89300,
    postsCount: 1650,
    isFollowing: false,
    verified: true,
    featuredPost: {
      title: "Phase III Efficacy Results on Multivalent Arbovirus Candidate in Sub-Saharan Africa",
      date: "Sep 8, 2026",
      snippet: "Promising antibody titers sustained across 18-month follow-up window in randomized double-blind evaluation.",
    },
  },
  {
    id: "pg-8",
    name: "NASA Jet Propulsion Laboratory (JPL) Science",
    handle: "@nasajpl_science",
    category: "Research Labs",
    avatar: "/images/resources/user-pic8.jpg",
    coverImage: "/images/resources/profile-banner-real.jpg",
    bio: "Robotic exploration of the solar system, planetary geology, Mars sample return instruments, and deep-space communications.",
    location: "Pasadena, CA, USA",
    website: "https://www.jpl.nasa.gov",
    followersCount: 310000,
    postsCount: 6200,
    isFollowing: true,
    verified: true,
    featuredPost: {
      title: "Perseverance Rover Uncovers Hydrated Silica Veins in Jezero Crater Delta",
      date: "Sep 14, 2026",
      snippet: "Spectrometer scans confirm micro-stratified mineral deposits consistent with ancient lacustrine hydrothermal activity.",
    },
  },
];

export function getPageById(id: string): PageItem | undefined {
  return INITIAL_PAGES.find((p) => p.id === id);
}
