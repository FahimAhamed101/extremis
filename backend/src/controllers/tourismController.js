const TourismPlace = require("../models/TourismPlace");

const DEFAULT_SEEDS = [
  {
    title: "Eiffel Tower & Paris River Seine",
    location: "Paris",
    country: "France",
    category: "city",
    coordinates: { lat: 48.8584, lng: 2.2945 },
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "The City of Light offers world-famous architecture, the iconic iron lattice Eiffel Tower, the Louvre museum, and vibrant Parisian cafe culture along the romantic Seine.",
    highlights: ["Eiffel Tower Summit", "Louvre Museum", "Seine Cruise", "Montmartre"],
    bestTimeToVisit: "April to October",
    likesCount: 142,
  },
  {
    title: "Mount Fuji & Five Lakes",
    location: "Honshu",
    country: "Japan",
    category: "nature",
    coordinates: { lat: 35.3606, lng: 138.7274 },
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Japan's highest and most revered peak, towering 3,776 meters. A legendary UNESCO World Heritage pilgrimage destination renowned for symmetrical snow-capped volcanic beauty.",
    highlights: ["Lake Kawaguchiko", "Chureito Pagoda", "Fujinomiya Trail", "Onsen Hot Springs"],
    bestTimeToVisit: "July to September (Climbing), Spring (Sakura)",
    likesCount: 238,
  },
  {
    title: "Santorini Caldera & Oia Village",
    location: "Cyclades",
    country: "Greece",
    category: "beach",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Famous volcanic island renowned for whitewashed cubiform houses clinging to 300m cliffs, cobalt-blue domes, dramatic sunsets, and turquoise Aegean waters.",
    highlights: ["Oia Sunset Viewpoint", "Red Beach", "Ancient Thira", "Caldera Catamaran Sailing"],
    bestTimeToVisit: "May to October",
    likesCount: 310,
  },
  {
    title: "Grand Canyon National Park",
    location: "Arizona",
    country: "United States",
    category: "adventure",
    coordinates: { lat: 36.1069, lng: -112.1129 },
    coverImage: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "A geological wonder carved by the Colorado River, exposing 2 billion years of Earth's history across 277 miles of dramatic canyon landscapes and towering red plateaus.",
    highlights: ["South Rim Skywalk", "Bright Angel Trail", "Helicopter Tour", "Colorado River Rafting"],
    bestTimeToVisit: "March to May & September to November",
    likesCount: 189,
  },
  {
    title: "Curzon Hall & Historic Dhaka",
    location: "Dhaka",
    country: "Bangladesh",
    category: "historic",
    coordinates: { lat: 23.7266, lng: 90.4035 },
    coverImage: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "An architectural masterpiece blending Mughal and European styles, serving as the Faculty of Science at University of Dhaka and a landmark of academic heritage.",
    highlights: ["Curzon Hall Gardens", "Lalbagh Fort", "Ahsan Manzil", "Buriganga River"],
    bestTimeToVisit: "November to February",
    likesCount: 175,
  },
  {
    title: "CERN & Lake Geneva",
    location: "Geneva",
    country: "Switzerland",
    category: "research",
    coordinates: { lat: 46.233, lng: 6.0557 },
    coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "The global center of fundamental particle physics and innovation, nestled between Lake Geneva and the majestic Alps.",
    highlights: ["Science Gateway", "Globe of Science", "Jet d'Eau Fountain", "Alps Panorama"],
    bestTimeToVisit: "May to September",
    likesCount: 198,
  },
];

async function ensureSeedData() {
  const count = await TourismPlace.countDocuments();
  if (count === 0) {
    await TourismPlace.insertMany(DEFAULT_SEEDS);
  }
}

async function getTourismPlaces(req, res, next) {
  try {
    await ensureSeedData();

    const { category, search, authorId, myOnly } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (myOnly === "true" && req.user) {
      filter.author = req.user._id;
    } else if (authorId) {
      filter.author = authorId;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const places = await TourismPlace.find(filter)
      .populate("author", "firstName lastName name avatarUrl username")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: "Tourism places loaded successfully.",
      total: places.length,
      places: places.map((p) => ({
        ...p,
        id: String(p._id),
        isMyPost: req.user ? String(p.author?._id || p.author) === String(req.user._id) : false,
      })),
    });
  } catch (error) {
    next(error);
  }
}

async function getTourismPlaceById(req, res, next) {
  try {
    const { id } = req.params;
    const place = await TourismPlace.findById(id)
      .populate("author", "firstName lastName name avatarUrl username")
      .lean();

    if (!place) {
      res.status(404).json({ message: "Tourism place not found." });
      return;
    }

    res.status(200).json({
      message: "Tourism place details loaded.",
      place: {
        ...place,
        id: String(place._id),
        isMyPost: req.user ? String(place.author?._id || place.author) === String(req.user._id) : false,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createTourismPlace(req, res, next) {
  try {
    const {
      title,
      location,
      country,
      category = "nature",
      lat,
      lng,
      coverImage,
      images = [],
      videoUrl,
      description,
      highlights = [],
      bestTimeToVisit = "Year-round",
    } = req.body;

    if (!title || !location || !country || !description) {
      res.status(400).json({ message: "Please provide title, location, country, and description." });
      return;
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ message: "Valid geographic coordinates (latitude and longitude) are required." });
      return;
    }

    const placeImages = Array.isArray(images) && images.length > 0 ? images : coverImage ? [coverImage] : [];
    const mainCover = coverImage || (placeImages.length > 0 ? placeImages[0] : null);

    const newPlace = await TourismPlace.create({
      title: title.trim(),
      location: location.trim(),
      country: country.trim(),
      category,
      coordinates: { lat: latitude, lng: longitude },
      coverImage: mainCover,
      images: placeImages,
      videoUrl: videoUrl ? videoUrl.trim() : null,
      description: description.trim(),
      highlights: Array.isArray(highlights) ? highlights.filter(Boolean) : [],
      bestTimeToVisit: bestTimeToVisit.trim(),
      author: req.user._id,
    });

    const populated = await TourismPlace.findById(newPlace._id)
      .populate("author", "firstName lastName name avatarUrl username")
      .lean();

    res.status(201).json({
      message: "Tourism place created successfully!",
      place: {
        ...populated,
        id: String(populated._id),
        isMyPost: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateTourismPlace(req, res, next) {
  try {
    const { id } = req.params;
    const place = await TourismPlace.findById(id);

    if (!place) {
      res.status(404).json({ message: "Tourism place not found." });
      return;
    }

    // Must be creator or admin
    if (String(place.author) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403).json({ message: "You are not authorized to update this tourism place." });
      return;
    }

    const {
      title,
      location,
      country,
      category,
      lat,
      lng,
      coverImage,
      images,
      videoUrl,
      description,
      highlights,
      bestTimeToVisit,
    } = req.body;

    if (title) place.title = title.trim();
    if (location) place.location = location.trim();
    if (country) place.country = country.trim();
    if (category) place.category = category;
    if (lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      place.coordinates = { lat: Number(lat), lng: Number(lng) };
    }
    if (coverImage !== undefined) place.coverImage = coverImage;
    if (Array.isArray(images)) place.images = images;
    if (videoUrl !== undefined) place.videoUrl = videoUrl ? videoUrl.trim() : null;
    if (description) place.description = description.trim();
    if (Array.isArray(highlights)) place.highlights = highlights;
    if (bestTimeToVisit) place.bestTimeToVisit = bestTimeToVisit.trim();

    await place.save();

    const updated = await TourismPlace.findById(id)
      .populate("author", "firstName lastName name avatarUrl username")
      .lean();

    res.status(200).json({
      message: "Tourism place updated successfully!",
      place: {
        ...updated,
        id: String(updated._id),
        isMyPost: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTourismPlace(req, res, next) {
  try {
    const { id } = req.params;
    const place = await TourismPlace.findById(id);

    if (!place) {
      res.status(404).json({ message: "Tourism place not found." });
      return;
    }

    // Must be creator or admin
    if (String(place.author) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403).json({ message: "You are not authorized to delete this tourism place." });
      return;
    }

    await TourismPlace.findByIdAndDelete(id);

    res.status(200).json({
      message: "Tourism place deleted successfully.",
      id,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTourismPlaces,
  getTourismPlaceById,
  createTourismPlace,
  updateTourismPlace,
  deleteTourismPlace,
};
