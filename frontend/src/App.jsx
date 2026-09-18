import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DriverProfile from "./pages/DriverProfile";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Home from "./pages/Home";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [earData, setEarData] = useState([]);
  const [perclos, setPerclos] = useState(0);
  const [headPose, setHeadPose] = useState("Forward");

  const fetchAlerts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alerts`);
    const data = await res.json();
    setAlerts(data);
  };

  const handleEarUpdate = (ear, mar) => {
    const time = new Date().toLocaleTimeString();
    setEarData((prev) => {
      const updated = [...prev, { time, ear, mar }];
      return updated.slice(-30);
    });
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleNewRide = async () => {
    if (window.confirm("Start new ride? All alerts will be cleared.")) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/alerts`, {
        method: "DELETE",
      });
      fetchAlerts();
    }
  };

  return (
    <div
      style={{
        background: "#0a0d14",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Navbar onNewRide={handleNewRide} />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "24px" }}>
          {/* LiveFeed hidden — always mounted */}
          <div style={{ display: "none" }}>
            <LiveFeed
              onDrowsy={fetchAlerts}
              onYawn={fetchAlerts}
              onEarUpdate={handleEarUpdate}
              onPerclosUpdate={setPerclos}
              onHeadPose={setHeadPose}
            />
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  alerts={alerts}
                  earData={earData}
                  fetchAlerts={fetchAlerts}
                  handleEarUpdate={handleEarUpdate}
                  perclos={perclos}
                  setPerclos={setPerclos}
                  headPose={headPose}
                  setHeadPose={setHeadPose}
                />
              }
            />
            <Route
              path="/reports"
              element={<Reports alerts={alerts} fetchAlerts={fetchAlerts} />}
            />
            <Route path="/profile" element={<DriverProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
