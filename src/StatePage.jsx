import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import "./StatePage.css";

const StatePage = (state) => {
  const { stateName } = useParams(); // Get state name from the URL
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/crime-statistics/state/${stateName.toUpperCase()}`)
      .then(response => {
        setStateData(response.data);
      })
      .catch(error => {
        console.error("Error fetching state data: ", error);
      });
  }, []);

  return (
    <div className="StatePage center-page">
      {stateData ? (
        <div>
         <div style={{ padding: '20px' }}>
              <h1>Crime Statistics for:  {stateName.toUpperCase()}</h1>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
{/*                         <th>ID</th> */}
                        <th>State</th>
                        <th>Crime Year</th>
                        <th>Rape</th>
                        <th>KA</th>
                        <th>DD</th>
                        <th>AOW</th>
                        <th>AOM</th>
                        <th>DV</th>
                        <th>WT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through the data and create a row for each record */}
                      {stateData.map(record => (
                        <tr key={record.id}>
{/*                           <td>{record.id}</td> */}
                          <td>{record.state}</td>
                          <td>{record.crimeYear}</td>
                          <td>{record.rape}</td>
                          <td>{record.ka}</td>
                          <td>{record.dd}</td>
                          <td>{record.aow}</td>
                          <td>{record.aom}</td>
                          <td>{record.dv}</td>
                          <td>{record.wt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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