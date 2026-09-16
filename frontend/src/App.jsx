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
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "24px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Stats alerts={alerts} />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "24px",
                      marginTop: "24px",
                    }}
                  >
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
                          gridTemplateColumns: "1fr 180px",
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
                        <AlertScore alerts={alerts} earData={earData} />
                      </div>
                      <EarGraph earData={earData} />
                    </div>
                    <AlertLog alerts={alerts} />
                  </div>
                  {/* PERCLOS Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "#111620",
                      border: "1px solid #1e2535",
                      padding: "12px 20px",
                      marginBottom: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontWeight: "600",
                      }}
                    >
                      PERCLOS Score
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "20px",
                        fontWeight: "700",
                        color:
                          perclos < 10
                            ? "#22c55e"
                            : perclos < 20
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {perclos}%
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      {perclos < 10
                        ? "— Alert"
                        : perclos < 20
                          ? "— Mildly Drowsy"
                          : "— Drowsy"}
                    </span>
                  </div>
                  {/* Head Pose Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "#111620",
                      border: "1px solid #1e2535",
                      padding: "12px 20px",
                      marginBottom: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontWeight: "600",
                      }}
                    >
                      Head Pose
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: headPose === "Forward" ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {headPose === "Forward" ? "✅" : "⚠️"} {headPose}
                    </span>
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
