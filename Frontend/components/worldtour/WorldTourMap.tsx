"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TourismPlaceItem } from "@/lib/services/authApi";

type WorldTourMapProps = {
  places: TourismPlaceItem[];
  selectedPlace: TourismPlaceItem | null;
  onSelectPlace: (place: TourismPlaceItem) => void;
  onOpenDetail?: (place: TourismPlaceItem) => void;
  onMapClickCoordinates?: (lat: number, lng: number) => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  nature: "#059669",
  historic: "#b45309",
  beach: "#0284c7",
  city: "#7c3aed",
  research: "#0891b2",
  adventure: "#ea580c",
};

export default function WorldTourMap({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenDetail,
  onMapClickCoordinates,
}: WorldTourMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25, 20],
      zoom: 2.8,
      zoomControl: false,
      minZoom: 2,
      maxZoom: 18,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (onMapClickCoordinates) {
        onMapClickCoordinates(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const color = CATEGORY_COLORS[place.category] || "#0284c7";
      const hasVideo = Boolean(place.videoUrl);

      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? "42px" : "34px"};
          height: ${isSelected ? "42px" : "34px"};
          border-radius: 50%;
          background: ${color};
          border: 3px solid #ffffff;
          color: #ffffff;
          box-shadow: 0 4px 16px ${color}99;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
        ">
          ${
            hasVideo
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? "18" : "14"}" height="${
                  isSelected ? "18" : "14"
                }" viewBox="0 0 24 24" fill="#ffffff" stroke="none">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? "18" : "14"}" height="${
                  isSelected ? "18" : "14"
                }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>`
          }
          ${
            hasVideo
              ? `<span style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; border-radius: 50%; background: #ef4444; border: 1.5px solid #ffffff;"></span>`
              : ""
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: `world-place-${place.id}`,
        html: markerHtml,
        iconSize: [isSelected ? 42 : 34, isSelected ? 42 : 34],
        iconAnchor: [isSelected ? 21 : 17, isSelected ? 21 : 17],
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: customIcon,
      });

      marker.on("click", () => {
        onSelectPlace(place);
      });

      const coverImg = place.coverImage || (place.images && place.images[0]) || "";
      const popupHtml = `
        <div style="font-family: inherit; width: 240px; padding: 2px;">
          ${
            coverImg
              ? `<div style="position: relative; width: 100%; height: 110px; border-radius: 10px; overflow: hidden; margin-bottom: 8px; background: #0f172a;">
                  <img src="${coverImg}" alt="${place.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                  ${
                    hasVideo
                      ? `<span style="position: absolute; bottom: 6px; left: 6px; background: rgba(0,0,0,0.75); color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px;">▶ Video</span>`
                      : ""
                  }
                  <span style="position: absolute; top: 6px; right: 6px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; background: ${color}; color: #ffffff; padding: 2px 7px; border-radius: 8px;">
                    ${place.category}
                  </span>
                </div>`
              : ""
          }
          <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">${place.location}, ${place.country}</div>
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.25;">${place.title}</h4>
          <p style="margin: 0 0 10px 0; font-size: 11.5px; color: #475569; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${place.description}
          </p>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button id="btn-popup-explore-${place.id}" style="width: 100%; text-align: center; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 6px 10px; border-radius: 8px; font-size: 11.5px; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4);">
              🎬 View Place & ${hasVideo ? "Watch Video" : "Gallery"}
            </button>
            <a href="/nearby?lat=${place.coordinates.lat}&lng=${place.coordinates.lng}&location=${encodeURIComponent(
        place.title,
      )}" style="width: 100%; text-align: center; background: #f1f5f9; color: #334155; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
              📍 Find People Nearby
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`btn-popup-explore-${place.id}`);
          if (btn && onOpenDetail) {
            btn.onclick = () => {
              onOpenDetail(place);
            };
          }
        }, 10);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [places, selectedPlace, onSelectPlace, onOpenDetail]);

  // Fly to selected place
  useEffect(() => {
    if (!selectedPlace || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
      10,
      { duration: 1.4 },
    );
  }, [selectedPlace]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "540px" }}>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%", minHeight: "540px", borderRadius: "18px" }}
      />
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 14px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 10px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
