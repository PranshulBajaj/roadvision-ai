import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Stats from "./components/Stats";
import AlertLog from "./components/AlertLog";
import LiveFeed from "./components/LiveFeed";
import EarGraph from "./components/EarGraph";
import AlertScore from "./components/AlertScore";
import DriverProfile from "./pages/DriverProfile";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";

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

  return (
    <div
      style={{
        background: "#0a0d14",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Navbar
        onNewRide={async () => {
          if (window.confirm("Start new ride? All alerts will be cleared.")) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/alerts`, {
              method: "DELETE",
            });
            fetchAlerts();
          }
        }}
      />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "24px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Stats alerts={alerts} />
                  {/* Main Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                      marginTop: "20px",
                    }}
                  >
                    {/* Left — Camera + Score + Graph */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <LiveFeed
                          onDrowsy={fetchAlerts}
                          onYawn={fetchAlerts}
                          onEarUpdate={handleEarUpdate}
                          onPerclosUpdate={setPerclos}
                          onHeadPose={setHeadPose}
                        />
                        <AlertScore
                          alerts={alerts}
                          earData={earData}
                          perclos={perclos}
                          headPose={headPose}
                        />
                      </div>
                      <EarGraph earData={earData} />
                    </div>

                    {/* Right — Alert Log */}
                    <AlertLog alerts={alerts} />
                  </div>
                </>
              }
            />
            <Route path="/reports" element={<Reports />} />
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
