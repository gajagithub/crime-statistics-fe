import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = "http://localhost:8080/api/crime-statistics/";
const GEOJSON_URL = "/india-map.json";

function Home() {
  const [crimeData, setCrimeData] = useState([]);
  const [geoJson, setGeoJson] = useState(null);


const summarizeByState = (data) => {
  return data.reduce((acc, current) => {
    // Find if the state already exists in the accumulator
    const existingState = acc.find(item => item.state.toString().toUpperCase() === current.state.toString().toUpperCase());

    if (existingState) {
      // If the state exists, add the values to the existing state object
      existingState.rape += current.rape;
      existingState.ka += current.ka;
      existingState.dd += current.dd;
      existingState.aow += current.aow;
      existingState.aom += current.aom;
      existingState.dv += current.dv;
      existingState.wt += current.wt;
    } else {
      // If the state does not exist, create a new entry
      acc.push({
        state: current.state,
        rape: current.rape,
        ka: current.ka,
        dd: current.dd,
        aow: current.aow,
        aom: current.aom,
        dv: current.dv,
        wt: current.wt
      });
    }

    return acc;
  }, []);
};


  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCrimeData(summarizeByState(data)))
      .catch((err) => console.error("Error fetching crime data:", err));

    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeoJson(data))
      .catch((err) => console.error("Error fetching GeoJSON:", err));
  }, []);

  const getCrimeRate = (stateName) => {
    const stateData = crimeData.find(
        (s) => s.state.toString().toUpperCase() == stateName.toString().toUpperCase());
    return stateData ? stateData.rape + stateData.ka + stateData.dd + stateData.aow + stateData.aom + stateData.dv + stateData.wt: 0;
  };

  const onEachState = (feature, layer) => {
    const stateName = feature.properties.st_nm;
    const crimeRate = getCrimeRate(stateName);
    layer.setStyle({
      fillColor:  crimeRate <= 10000 ? "yellow" : crimeRate >= 10000 && crimeRate <= 80000 ? "orange" :
        crimeRate >= 80000 && crimeRate <= 200000 ? "purple" : crimeRate >= 200000 ? "red": "white",
      fillOpacity: 0.7,
      color: "black",
      weight: 1,
    });
   // Bind Tooltip to show the name of the state when hovering over it
    layer.bindTooltip(feature.properties.name, {
      permanent: false,  // Tooltip will only show on hover, not permanently
      direction: 'center',  // Position the tooltip in the center of the state
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