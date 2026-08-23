function AlertLog({ alerts }) {
  return (
    <div
      style={{
        background: "#111620",
        border: "1px solid #1e2535",
        borderRadius: "8px",
        padding: "20px",
        height: "100%",
        overflowY: "auto", // scroll hoga agar alerts zyada hon
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: "600",
          marginBottom: "12px",
        }}
      >
        Alert Log
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {alerts.length === 0 && (
          <div style={{ color: "#64748b", fontSize: "13px" }}>
            No alerts yet...
          </div>
        )}
        {alerts.slice(0, 8).map(alert => (
          <div
            key={alert._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #1e2535",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                background:
                  alert.type === "DROWSY"
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(245,158,11,0.15)",
              }}
            >
              {alert.type === "DROWSY" ? "😴" : "🥱"}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: alert.type === "DROWSY" ? "#ef4444" : "#f59e0b",
                }}
              >
                {alert.type}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontFamily: "monospace",
                }}
              >
                {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              EAR: {alert.earValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertLog;
