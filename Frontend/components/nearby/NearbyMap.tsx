"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { NearbyPerson } from "@/lib/services/authApi";

type NearbyMapProps = {
  origin: { lat: number; lng: number; location: string };
  radiusKm: number | null;
  people: NearbyPerson[];
  selectedPersonId: string | null;
  onSelectPerson: (personId: string) => void;
};

export default function NearbyMap({
  origin,
  radiusKm,
  people,
  selectedPersonId,
  onSelectPerson,
}: NearbyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [origin.lat, origin.lng],
      zoom: radiusKm && radiusKm <= 10 ? 12 : radiusKm && radiusKm <= 50 ? 10 : 7,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // Modern OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Mount only once

  // Update center, radius circle, and markers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Center on origin
    map.setView([origin.lat, origin.lng], map.getZoom(), { animate: true });

    // Draw radius circle if radius is set
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
      circleLayerRef.current = null;
    }

    if (radiusKm && radiusKm > 0) {
      circleLayerRef.current = L.circle([origin.lat, origin.lng], {
        radius: radiusKm * 1000,
        color: "#0284c7",
        fillColor: "#38bdf8",
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: "6, 8",
      }).addTo(map);
    }

    // Clear and redraw markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      // 1. User Origin Marker
      const originIcon = L.divIcon({
        className: "leaflet-user-origin",
        html: `
          <div style="position: relative; width: 26px; height: 26px;">
            <div style="position: absolute; inset: -6px; border-radius: 50%; background: rgba(2, 132, 199, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 26px; height: 26px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.5); display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const userMarker = L.marker([origin.lat, origin.lng], { icon: originIcon });
      userMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px 6px; text-align: center;">
          <b style="color: #0284c7; font-size: 14px;">📍 Your Location</b>
          <p style="margin: 4px 0 0 0; color: #475569; font-size: 12px;">${origin.location || "Current Coordinate"}</p>
        </div>
      `);
      markersLayerRef.current.addLayer(userMarker);

      // 2. Nearby People Markers
      people.forEach((person) => {
        if (!person.coordinates) return;

        const isSelected = selectedPersonId === person.id;
        const avatarUrl = person.avatarUrl || "/images/resources/user.jpg";

        const markerHtml = `
          <div style="
            position: relative;
            width: ${isSelected ? "44px" : "38px"};
            height: ${isSelected ? "44px" : "38px"};
            border-radius: 50%;
            background: #ffffff;
            border: 3px solid ${isSelected ? "#0284c7" : "#38bdf8"};
            box-shadow: 0 4px 14px ${isSelected ? "rgba(2, 132, 199, 0.6)" : "rgba(0, 0, 0, 0.18)"};
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: all 0.2s ease;
            transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
          ">
            <img src="${avatarUrl}" alt="${person.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/images/resources/user.jpg'" />
          </div>
        `;

        const personMarkerIcon = L.divIcon({
          className: `leaflet-person-marker-${person.id}`,
          html: markerHtml,
          iconSize: [isSelected ? 44 : 38, isSelected ? 44 : 38],
          iconAnchor: [isSelected ? 22 : 19, isSelected ? 22 : 19],
        });

        const marker = L.marker([person.coordinates.lat, person.coordinates.lng], {
          icon: personMarkerIcon,
        });

        marker.on("click", () => {
          onSelectPerson(person.id);
        });

        const headline = person.position || person.department || person.institute || "Researcher";

        const popupContent = `
          <div style="font-family: inherit; width: 220px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <img src="${avatarUrl}" alt="${person.name}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #0284c7;" onerror="this.src='/images/resources/user.jpg'" />
              <div>
                <h5 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">${person.name}</h5>
                <span style="font-size: 11px; color: #0284c7; font-weight: 600; background: #e0f2fe; padding: 2px 6px; border-radius: 10px; display: inline-block; margin-top: 2px;">
                  📍 ${person.distanceFormatted}
                </span>
              </div>
            </div>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.3;">${headline}</p>
            ${person.location ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #94a3b8;">🏢 ${person.location}</p>` : ""}
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <a href="${person.profileHref}" style="flex: 1; text-align: center; background: #0284c7; color: #ffffff; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">View Profile</a>
              <a href="/messages?user=${person.id}" style="background: #f1f5f9; color: #334155; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">Chat</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [origin, radiusKm, people, selectedPersonId, onSelectPerson]);

  // Focus on selected person
  useEffect(() => {
    if (!selectedPersonId || !mapInstanceRef.current) return;
    const target = people.find((p) => p.id === selectedPersonId);
    if (target?.coordinates) {
      mapInstanceRef.current.flyTo([target.coordinates.lat, target.coordinates.lng], 14, {
        duration: 1.2,
      });
    }
  }, [selectedPersonId, people]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "480px" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%", minHeight: "480px", borderRadius: "16px", zIndex: 1 }} />
      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
