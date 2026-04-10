import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';

// Icons
const greenIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [32, 32]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  iconSize: [32, 32]
});

const redIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32]
});

const getIcon = (severity) => {
  if (severity === "low") return greenIcon;
  if (severity === "medium") return orangeIcon;
  return redIcon;
};

export default function MapView() {

  const [reports, setReports] = useState([
    { id: 1, lat: 13.0827, lng: 80.2707, severity: "low", status: "reported" },
    { id: 2, lat: 13.09, lng: 80.28, severity: "medium", status: "reported" },
    { id: 3, lat: 13.07, lng: 80.26, severity: "high", status: "reported" },
    { id: 4, lat: 13.1, lng: 80.25, severity: "medium", status: "reported" },
    { id: 5, lat: 13.06, lng: 80.29, severity: "low", status: "reported" }
  ]);

  const handleClaim = (id) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id
          ? { ...report, status: "in-progress" }
          : report
      )
    );
  };

  const total = reports.length;
  const inProgress = reports.filter(r => r.status === "in-progress").length;
  const cleaned = reports.filter(r => r.status === "cleaned").length;

  return (
    <div style={{ position: "relative" }}>

      {/* Dashboard */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        background: "white",
        padding: "10px",
        borderRadius: "8px"
      }}>
        <b>Dashboard</b><br />
        Total: {total} <br />
        In Progress: {inProgress} <br />
        Cleaned: {cleaned}
      </div>

      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={getIcon(report.severity)}
          >
            <Popup>
              <b>Garbage Spot</b><br />
              Severity: {report.severity}<br />
              Status: {report.status} <br /><br />

              {report.status === "reported" && (
                <button onClick={() => handleClaim(report.id)}>
                  Claim
                </button>
              )}

              {report.status === "in-progress" && (
                <span style={{ color: "orange" }}>
                  🚧 In Progress
                </span>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}