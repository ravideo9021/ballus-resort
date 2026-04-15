"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  lat: number;
  lng: number;
}

export function LeafletMap({ lat, lng }: LeafletMapProps) {
  useEffect(() => {
    // Fix default icon path issue with webpack
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const goldIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="width:32px;height:32px;background:#C9A24B;border:3px solid #0B1B22;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={goldIcon}>
        <Popup>
          <strong>Ballu&apos;s Resort &amp; Café</strong>
          <br />
          14 Mile Road, Beas Riverside
          <br />
          Manali — 175131
        </Popup>
      </Marker>
    </MapContainer>
  );
}
