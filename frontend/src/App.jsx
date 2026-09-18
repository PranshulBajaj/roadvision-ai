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
                  {/* Top bar — Stats + PERCLOS + Head Pose + New Ride */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Stats alerts={alerts} />

                    {/* PERCLOS */}
                    <div
                      style={{
                        background: "#111620",
                        border: "1px solid #1e2535",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        PERCLOS
                      </span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "18px",
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
                    </div>

                    {/* Head Pose */}
                    <div
                      style={{
                        background: "#111620",
                        border: "1px solid #1e2535",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
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
                          fontSize: "18px",
                          fontWeight: "700",
                          color: headPose === "Forward" ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {headPose === "Forward" ? "✅" : "⚠️"} {headPose}
                      </span>
                    </div>

                    {/* New Ride Button */}
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Start new ride? All alerts will be cleared.",
                          )
                        ) {
                          await fetch(
                            `${import.meta.env.VITE_API_URL}/api/alerts`,
                            { method: "DELETE" },
                          );
                          fetchAlerts();
                        }
                      }}
                      style={{
                        background: "#22c55e",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginLeft: "auto",
                      }}
                    >
                      🚗 Start New Ride
                    </button>
                  </div>

                  {/* Main Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
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
                          gridTemplateColumns: "1fr 1fr",
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
