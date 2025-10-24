import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = ({ source, destination, path }) => {
  return (
    <MapContainer center={[28.61, 77.23]} zoom={12} style={{ height: "500px", width: "100%" }}>
      {/* Background tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Source marker */}
      {source && (
        <Marker position={source}>
          <Popup>Source</Popup>
        </Marker>
      )}

      {/* Destination marker */}
      {destination && (
        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* Path line */}
      {path && (
        <Polyline positions={path} color="blue" />
      )}
    </MapContainer>
  );
};

export default MapView;
