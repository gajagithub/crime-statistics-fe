import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = "http://localhost:8080/api/crime-statistics/";
const GEOJSON_URL = "/india-map.json";

function Home() {
  const [crimeData, setCrimeData] = useState([]);
  const [geoJson, setGeoJson] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCrimeData(data))
      .catch((err) => console.error("Error fetching crime data:", err));

    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeoJson(data))
      .catch((err) => console.error("Error fetching GeoJSON:", err));
  }, [crimeData]);

  const getCrimeRate = (stateName) => {

    const stateData = crimeData.find((s) => s.state === stateName);

    return stateData ? stateData.rape + stateData.ka + stateData.dd + stateData.aow + stateData.aom + stateData.dv + stateData.wt: 0;
  };

  const onEachState = (feature, layer) => {
    const stateName = feature.properties.st_nm;
    const crimeRate = getCrimeRate(stateName);
    layer.setStyle({
      fillColor:  crimeRate <= 5000 ? "yellow" : crimeRate >= 5000 && crimeRate <= 10000 ? "orange" :
        crimeRate >= 10000 && crimeRate <= 20000 ? "purple" : crimeRate >= 20000 ? "red": "white",
      fillOpacity: 0.7,
      color: "black",
      weight: 1,
    });
    layer.bindPopup(`<b>${stateName}</b><br>Crime Rate: ${crimeRate}`);
    layer.on("click", () => {
      window.location.href = `/state/${stateName}`;
    });
  };

  return (
    <div>
      <h1>Crime Statistics in India</h1>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoJson && <GeoJSON data={geoJson} onEachFeature={onEachState} />}
      </MapContainer>
    </div>
  );
}
export default Home;