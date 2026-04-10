import { MapContainer, TileLayer } from 'react-leaflet';

export default function MapView() {
  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}