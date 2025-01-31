import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import StatePage from "./StatePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/state/:stateName" element={<StatePage />} />
      </Routes>
    </Router>
  );
}

export default App;