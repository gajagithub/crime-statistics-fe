import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import "./StatePage.css";

const StatePage = (state) => {
  const { stateName } = useParams(); // Get state name from the URL
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/crime-statistics/state/${stateName}`)
      .then(response => {
        setStateData(response.data[0]); // Assuming the state is unique in the dataset
      })
      .catch(error => {
        console.error("Error fetching state data: ", error);
      });
  }, [stateName]);

  return (
    <div className="StatePage center-page">
      {stateData ? (
        <div>
           <h1>Crime Statistics for:  {stateData.state}</h1>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Rape</th>
                <th>K&A</th>
                <th>DD</th>
                <th>AoW</th>
                <th>AoM</th>
                <th>DV</th>
                <th>WT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stateData.crimeYear}</td>
                <td>{stateData.rape}</td>
                <td>{stateData.ka}</td>
                <td>{stateData.dd}</td>
                <td>{stateData.aow}</td>
                <td>{stateData.aom}</td>
                <td>{stateData.dv}</td>
                <td>{stateData.wt}</td>
              </tr>
            </tbody>
          </table>

          {/* <ul>
         <li>Rape: {stateData.rape}</li>
           <li>Kidnapping: {stateData.ka}</li>
           <li>Dowry Deaths: {stateData.dd}</li>
           <li>Assault on Women: {stateData.aow}</li>
         </ul> */}

        </div>
      ) : (
        <p>Loading...</p>
      )}
      <br></br>
      <h2> <Link to="/">Back to Home</Link> </h2>
    </div>
  );
};

export default StatePage;