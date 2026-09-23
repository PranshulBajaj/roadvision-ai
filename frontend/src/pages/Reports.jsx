import { useState, useEffect } from "react";

function Reports({ alerts, fetchAlerts }) {
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const drowsyCount = alerts.filter((a) => a.type === "DROWSY").length;
  const yawnCount = alerts.filter((a) => a.type === "YAWN").length;
  const score =
    alerts.length === 0 ? 100 : Math.max(0, Math.round(100 - drowsyCount * 15));
  const label = score >= 80 ? "Alert" : score >= 50 ? "Moderate" : "Drowsy";

  const handleGenerate = () => {
    setGenerating(true);

    const content = `
ROADVISION AI — SESSION REPORT
===============================
Generated: ${new Date().toLocaleString()}
Driver: Pranshul
Institution: MSIT, New Delhi

SESSION SUMMARY
---------------
Total Alerts    : ${alerts.length}
Drowsy Events   : ${drowsyCount}
Yawn Events     : ${yawnCount}
Alertness Score : ${score}/100 (${label})

ALERT LOG
---------
${alerts
  .map(
    (a, i) =>
      `${i + 1}. ${a.type} | EAR: ${a.earValue} | MAR: ${a.marValue} | Time: ${new Date(a.timestamp).toLocaleString()}`,
  )
  .join("\n")}

THRESHOLDS USED
---------------
EAR Threshold   : 0.28
MAR Threshold   : 0.50
Drowsy Frames   : 40 (~1.5 sec)
Yawn Frames     : 30 (~1 sec)

--
RoadVision AI | MSIT, New Delhi | 2026-27
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RoadVisionAI_Report_${new Date().toLocaleDateString().replace(/\//g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setGenerating(false);
  };

  const card = {
    background: "#111620",
    border: "1px solid #1e2535",
    borderRadius: "8px",
    padding: "24px",
  };

  const label2 = {
    fontSize: "11px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "600",
    marginBottom: "16px",
  };

  return (
    <div style={{ color: "#e2e8f0" }}>
      <h2 style={{ marginBottom: "24px", fontSize: "22px" }}>Session Report</h2>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {[
          { label: "Total Alerts", value: alerts.length, color: "#3b82f6" },
          { label: "Drowsy Events", value: drowsyCount, color: "#ef4444" },
          { label: "Yawn Events", value: yawnCount, color: "#f59e0b" },
          {
            label: "Alertness Score",
            value: loading ? "..." : `${score}/100`,
            color:
              score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444",
          },
        ].map((c) => (
          <div key={c.label} style={card}>
            <div style={label2}>{c.label}</div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                fontFamily: "monospace",
                color: c.color,
              }}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Alert Table */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <div style={label2}>Alert Log</div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2535" }}>
              {["#", "Type", "EAR Value", "MAR Value", "Timestamp"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={a._id} style={{ borderBottom: "1px solid #1e2535" }}>
                <td style={{ padding: "10px", color: "#64748b" }}>{i + 1}</td>
                <td
                  style={{
                    padding: "10px",
                    color: a.type === "DROWSY" ? "#ef4444" : "#f59e0b",
                    fontWeight: "600",
                  }}
                >
                  {a.type === "DROWSY" ? "😴" : "🥱"} {a.type}
                </td>
                <td style={{ padding: "10px", fontFamily: "monospace" }}>
                  {a.earValue}
                </td>
                <td style={{ padding: "10px", fontFamily: "monospace" }}>
                  {a.marValue}
                </td>
                <td style={{ padding: "10px", color: "#64748b" }}>
                  {new Date(a.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No alerts recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Download Button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 32px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        {generating ? "Generating..." : "⬇️ Download Report"}
      </button>
    </div>
  );
}

export default Reports;
