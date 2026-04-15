"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./leaflet-map").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full min-h-[400px] bg-[#0F3B47] flex items-center justify-center text-[#F5EFE3]/60">
      Loading map...
    </div>
  ),
});

export function MapWrapper({ lat, lng }: { lat: number; lng: number }) {
  return <LeafletMap lat={lat} lng={lng} />;
}
