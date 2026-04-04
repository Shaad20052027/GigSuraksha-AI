import { lazy, Suspense } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getRiskLevel } from "@/lib/insurance";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface RiskZone {
  name: string;
  lat: number;
  lng: number;
  risk: "low" | "medium" | "high";
  label: string;
}

const CITY_ZONES: Record<string, { center: [number, number]; zones: RiskZone[] }> = {
  delhi: {
    center: [28.6139, 77.209],
    zones: [
      { name: "Connaught Place", lat: 28.6315, lng: 77.2167, risk: "high", label: "Heavy traffic + AQI hotspot" },
      { name: "Karol Bagh", lat: 28.6519, lng: 77.1905, risk: "high", label: "Flood-prone area" },
      { name: "Saket", lat: 28.5244, lng: 77.2066, risk: "medium", label: "Moderate congestion" },
      { name: "Dwarka", lat: 28.5921, lng: 77.0460, risk: "low", label: "Open roads, low risk" },
      { name: "Rohini", lat: 28.7495, lng: 77.0565, risk: "medium", label: "AQI elevated zone" },
      { name: "Lajpat Nagar", lat: 28.5700, lng: 77.2373, risk: "high", label: "Waterlogging risk" },
    ],
  },
  bangalore: {
    center: [12.9716, 77.5946],
    zones: [
      { name: "Koramangala", lat: 12.9352, lng: 77.6245, risk: "medium", label: "Rain-prone zone" },
      { name: "Whitefield", lat: 12.9698, lng: 77.7500, risk: "low", label: "Clear conditions" },
      { name: "Majestic", lat: 12.9767, lng: 77.5713, risk: "high", label: "Heavy traffic hotspot" },
      { name: "Electronic City", lat: 12.8399, lng: 77.6770, risk: "low", label: "Low congestion" },
      { name: "Indiranagar", lat: 12.9784, lng: 77.6408, risk: "medium", label: "Moderate rain risk" },
    ],
  },
  lucknow: {
    center: [26.8467, 80.9462],
    zones: [
      { name: "Hazratganj", lat: 26.8500, lng: 80.9450, risk: "high", label: "Flood & heat risk" },
      { name: "Gomti Nagar", lat: 26.8560, lng: 80.9918, risk: "medium", label: "Moderate AQI" },
      { name: "Aliganj", lat: 26.8950, lng: 80.9400, risk: "low", label: "Open area, low risk" },
      { name: "Charbagh", lat: 26.8350, lng: 80.9210, risk: "high", label: "Congestion & heat" },
    ],
  },
  mumbai: {
    center: [19.076, 72.8777],
    zones: [
      { name: "Andheri", lat: 19.1136, lng: 72.8697, risk: "high", label: "Severe waterlogging" },
      { name: "Bandra", lat: 19.0596, lng: 72.8295, risk: "high", label: "Flood-prone coastal" },
      { name: "Powai", lat: 19.1176, lng: 72.9060, risk: "medium", label: "Moderate rain risk" },
      { name: "Navi Mumbai", lat: 19.0330, lng: 73.0297, risk: "low", label: "Lower density zone" },
      { name: "Dadar", lat: 19.0178, lng: 72.8478, risk: "high", label: "Heavy flooding zone" },
    ],
  },
  hyderabad: {
    center: [17.385, 78.4867],
    zones: [
      { name: "HITEC City", lat: 17.4435, lng: 78.3772, risk: "low", label: "Low risk, open roads" },
      { name: "Charminar", lat: 17.3616, lng: 78.4747, risk: "high", label: "Congestion & heat" },
      { name: "Gachibowli", lat: 17.4401, lng: 78.3489, risk: "low", label: "Well-planned zone" },
      { name: "Secunderabad", lat: 17.4399, lng: 78.4983, risk: "medium", label: "Moderate risk" },
    ],
  },
};

const RISK_COLORS = {
  low: { color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.25 },
  medium: { color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.25 },
  high: { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.3 },
};

interface RiskMapProps {
  cityKey: string;
  overallRisk: number;
}

export default function RiskMap({ cityKey, overallRisk }: RiskMapProps) {
  const cityData = CITY_ZONES[cityKey] || CITY_ZONES.delhi;
  const level = getRiskLevel(overallRisk);

  const zones = cityData.zones.map((z) => {
    if (overallRisk > 65 && z.risk === "medium") return { ...z, risk: "high" as const };
    return z;
  });

  return (
    <div className="rounded-xl overflow-hidden border border-border" style={{ height: 220 }}>
      <MapContainer
        center={cityData.center}
        zoom={12}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {zones.map((zone) => {
          const style = RISK_COLORS[zone.risk];
          return (
            <Circle
              key={zone.name}
              center={[zone.lat, zone.lng]}
              radius={zone.risk === "high" ? 1200 : zone.risk === "medium" ? 900 : 700}
              pathOptions={style}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{zone.name}</strong>
                  <br />
                  <span style={{ color: style.color, fontWeight: 600 }}>{zone.risk.toUpperCase()} RISK</span>
                  <br />
                  {zone.label}
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
