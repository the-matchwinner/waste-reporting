import { useMapEvents } from 'react-leaflet';
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

  // ✅ UPDATED REPORTS (Delhi Areas)
  const [reports, setReports] = useState([
    { id: 1, area: "Subhash Nagar", lat: 28.6417, lng: 77.0870, severity: "low", status: "reported" },
    { id: 2, area: "Tilak Nagar", lat: 28.6365, lng: 77.0965, severity: "medium", status: "reported" },
    { id: 3, area: "Hari Nagar", lat: 28.6310, lng: 77.1100, severity: "high", status: "reported" },
    { id: 4, area: "Rajouri Garden", lat: 28.6460, lng: 77.1160, severity: "medium", status: "reported" },
    { id: 5, area: "West Delhi Spot", lat: 28.6380, lng: 77.1020, severity: "low", status: "reported" }
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

  const handleClean = (id) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id
          ? { ...report, status: "cleaned" }
          : report
      )
    );
  };

  const total = reports.length;
  const inProgress = reports.filter(r => r.status === "in-progress").length;
  const cleaned = reports.filter(r => r.status === "cleaned").length;

  function AddReport({ setReports }) {
    useMapEvents({
      click(e) {
        const newReport = {
          id: Date.now(),
          area: "New Location", // ✅ added area field
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          severity: "low",
          status: "reported"
        };

        setReports(prev => [...prev, newReport]);
      }
    });

    return null;
  }

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
        center={[28.6139, 77.2090]}   // ✅ Delhi center
        zoom={12}                     // ✅ better zoom for multiple areas
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <AddReport setReports={setReports} />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={getIcon(report.severity)}
          >
            <Popup>
              {/* ✅ AREA NAME ADDED */}
              <b>{report.area}</b><br />
              Severity: {report.severity}<br />
              Status: {report.status} <br /><br />

              {report.status === "reported" && (
                <button onClick={() => handleClaim(report.id)}>
                  Claim
                </button>
              )}

              {report.status === "in-progress" && (
                <>
                  <span style={{ color: "orange" }}>🚧 In Progress</span><br /><br />
                  <button onClick={() => handleClean(report.id)}>
                    Mark as Cleaned
                  </button>
                </>
              )}

              {report.status === "cleaned" && (
                <span style={{ color: "green" }}>
                  ✅ Cleaned
                </span>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}