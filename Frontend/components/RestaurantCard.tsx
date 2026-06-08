import Link from "next/link";
import Image from "next/image";

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  distance: number;
  image: string;
  status: "open" | "closed";
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
        {/* Restaurant Image */}
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {restaurant.name}
          </h3>

          {/* Rating & Pickup */}
          <div className="flex gap-2 mb-3">
            <div className="flex items-center px-3 py-1 rounded-full border border-gray-200 gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-xs font-semibold text-gray-700">
                {restaurant.rating} • {restaurant.reviews} ratings
              </span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-full border border-gray-200 gap-1">
              <span className="text-gray-600">🚚</span>
              <span className="text-xs font-semibold text-gray-700">
                {restaurant.distance.toFixed(2)} mi
              </span>
            </div>
          </div>

          {/* Location */}
          <p className="text-xs text-gray-500 mb-2">📍 {restaurant.location}</p>

          {/* Status */}
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              restaurant.status === "open"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {restaurant.status === "open" ? "Open Now" : "Closed"}
          </div>
        </div>
      </div>
    </Link>
  );
}
