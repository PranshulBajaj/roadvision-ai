import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import AlertLog from "./components/AlertLog";
import LiveFeed from "./components/LiveFeed";
import EarGraph from "./components/EarGraph";
import AlertScore from "./components/AlertScore";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [earData, setEarData] = useState([]);

  const fetchAlerts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alerts`)
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
      <Stats alerts={alerts} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "24px",
          padding: "24px",
        }}
      >
        {/* Camera + Right side (Score + Graph) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "16px",
            alignItems: "stretch",
          }}
        >
          {/* Camera */}
          <LiveFeed
            onDrowsy={fetchAlerts}
            onYawn={fetchAlerts}
            onEarUpdate={handleEarUpdate}
          />

          {/* Right — Score upar, Graph neeche */}
          <div
            style={{ display: "flex", flexDirection: "column"}}
          >
            <AlertScore alerts={alerts} earData={earData} />
            <EarGraph earData={earData} />
          </div>
        </div>

        <div style={{ height: "100%" }}>
          <AlertLog alerts={alerts} />
        </div>
      </div>
    </div>
  );
}

export default App;
