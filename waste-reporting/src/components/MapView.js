// src/components/MapView.js

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.heat/dist/leaflet-heat.js";

/* ---------------- ICONS ---------------- */

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
});

/* ---------------- HELPERS ---------------- */

function MapController({ setMap }) {
  const map = useMap();
  setMap(map);
  return null;
}

function ClickHandler({ setTempMarker }) {
  useMapEvents({
    click(e) {
      setTempMarker(e.latlng);
    },
  });
  return null;
}

/* ---------------- MAIN ---------------- */

export default function MapView({ user }) {
  const INDIA_CENTER = [22.5937, 78.9629];

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);

  const [heatmapOn, setHeatmapOn] = useState(false);
  const [heatLayer, setHeatLayer] = useState(null);

  const [mapStyle, setMapStyle] = useState("default");
  const [previousPosition, setPreviousPosition] = useState(null);

  const role = user?.role || "public";

  /* ---------------- ADD MARKER + DUPLICATE DETECTION ---------------- */

  const addMarker = (position, level) => {
    const threshold = 0.001;
    let found = false;

    const updated = markers.map((m) => {
      const distance =
        Math.abs(m.position.lat - position.lat) +
        Math.abs(m.position.lng - position.lng);

      if (distance < threshold) {
        found = true;
        return {
          ...m,
          reports: (m.reports || 1) + 1,
        };
      }
      return m;
    });

    if (found) {
      setMarkers(updated);
    } else {
      setMarkers([
        ...markers,
        {
          id: Date.now(),
          position,
          level,
          status: "pending",
          reports: 1,
        },
      ]);
    }

    setTempMarker(null);
  };

  /* ---------------- DASHBOARD ---------------- */

  const total = markers.length;
  const pending = markers.filter((m) => m.status === "pending").length;
  const claimed = markers.filter((m) => m.status === "claimed").length;
  const completed = markers.filter((m) => m.status === "completed").length;

  const high = markers.filter((m) => m.level === "high").length;
  const medium = markers.filter((m) => m.level === "medium").length;
  const low = markers.filter((m) => m.level === "low").length;

  const progress =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  /* ---------------- HEATMAP (FIXED) ---------------- */

  useEffect(() => {
    if (!map) return;

    if (heatLayer) map.removeLayer(heatLayer);

    if (heatmapOn && markers.length > 0) {
      const points = markers.map((m) => {
        const base =
          m.level === "high" ? 1.5 :
          m.level === "medium" ? 1.0 : 0.5;

        const multiplier = m.reports || 1;

        return [
          m.position.lat,
          m.position.lng,
          base * multiplier,
        ];
      });

      const layer = window.L.heatLayer(points, {
        radius: 40,
        blur: 25,
        minOpacity: 0.5,
        gradient: {
          0.2: "green",
          0.4: "yellow",
          0.6: "orange",
          0.8: "red",
          1.0: "#800000",
        },
        
      });

      layer.addTo(map);
      setHeatLayer(layer);
    }
  }, [heatmapOn, markers, map]);

  /* ---------------- MAP STYLE ---------------- */

  const getTileUrl = () => {
    if (mapStyle === "dark")
      return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    if (mapStyle === "terrain")
      return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };

  /* ---------------- CONTROLS ---------------- */

  const locateMe = () => {
    if (!map) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setPreviousPosition(map.getCenter());
      map.setView([pos.coords.latitude, pos.coords.longitude], 15);
    });
  };

  const resetView = () => {
    if (map) map.setView(INDIA_CENTER, 5);
  };

  const goBack = () => {
    if (map && previousPosition) {
      map.setView(previousPosition, 13);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px",
        background: "#1e293b",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        <h2>Dashboard</h2>

        <p>Total Reports: {total}</p>

        {/* PROGRESS */}
        <div>
          <h4>Progress</h4>
          <div style={{
            background: "#334155",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${progress}%`,
              background: "green",
              color: "white",
              textAlign: "center",
              padding: "5px"
            }}>
              {progress}%
            </div>
          </div>
        </div>

        <div>
          <h4>Status</h4>
          <p>Pending: {pending}</p>
          <p>Claimed: {claimed}</p>
          <p>Completed: {completed}</p>
        </div>

        <div>
          <h4>Garbage Levels</h4>
          <p>High: {high}</p>
          <p>Medium: {medium}</p>
          <p>Low: {low}</p>
        </div>

        <button onClick={() => setHeatmapOn(!heatmapOn)}>
          Toggle Heatmap
        </button>

        <div>
          <button onClick={() => setMapStyle("default")}>Default</button>
          <button onClick={() => setMapStyle("dark")}>Dark</button>
          <button onClick={() => setMapStyle("terrain")}>Terrain</button>
        </div>
      </div>

      {/* MAP AREA */}
      <div style={{ flex: 1, position: "relative" }}>

        {/* CONTROLS */}
        <div style={{ position: "absolute", left: 10, bottom: 20, zIndex: 1000 }}>
          <button onClick={goBack}>Go Back</button><br />
          <button onClick={resetView}>Reset</button><br />
          <button onClick={locateMe}>Locate Me</button>
        </div>

        <MapContainer
          center={INDIA_CENTER}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <MapController setMap={setMap} />
          <TileLayer url={getTileUrl()} />
          <ClickHandler setTempMarker={setTempMarker} />

          {/* TEMP MARKER */}
          {tempMarker && (
            <Marker position={tempMarker} icon={yellowIcon}>
              <Popup>
                <p>Select intensity:</p>
                <button onClick={() => addMarker(tempMarker, "low")}>Low</button>
                <button onClick={() => addMarker(tempMarker, "medium")}>Medium</button>
                <button onClick={() => addMarker(tempMarker, "high")}>High</button>
              </Popup>
            </Marker>
          )}

          {/* FINAL MARKERS */}
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={m.position}
              icon={
                m.status === "completed"
                  ? greenIcon
                  : m.status === "claimed"
                  ? yellowIcon
                  : redIcon
              }
            >
              <Popup>
                <p>Level: {m.level}</p>
                <p>Status: {m.status}</p>

                {role === "volunteer" && (
                  <>
                    {m.status === "pending" && (
                      <button onClick={() =>
                        setMarkers(prev =>
                          prev.map(x =>
                            x.id === m.id ? { ...x, status: "claimed" } : x
                          )
                        )
                      }>
                        Claim
                      </button>
                    )}

                    {m.status === "claimed" && (
                      <button onClick={() =>
                        setMarkers(prev =>
                          prev.map(x =>
                            x.id === m.id ? { ...x, status: "completed" } : x
                          )
                        )
                      }>
                        Mark Done
                      </button>
                    )}
                  </>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}