function AlertScore({ alerts, earData }) {
  const total = alerts.length;
  const drowsy = alerts.filter((a) => a.type === "DROWSY").length;
  const score = total === 0 ? 100 : Math.max(0, Math.round(100 - drowsy * 15));
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Alert" : score >= 50 ? "Moderate" : "Drowsy";

  // Latest EAR value
  const latestEAR = earData.length > 0 ? earData[earData.length - 1].ear : null;
  const latestMAR = earData.length > 0 ? earData[earData.length - 1].mar : null;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      style={{
        background: "#111620",
        border: "1px solid #1e2535",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        height: "100%",
      }}
    >
      {/* Ring */}
      <div style={{ position: "relative", width: "90px", height: "90px" }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="#1e2535"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            fontSize: "18px",
            fontWeight: "700",
            color,
          }}
        >
          {score}
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: "600", color, fontSize: "14px" }}>
          {label}
        </div>
        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
          {drowsy} drowsy events
        </div>
      </div>

      {/* Live EAR/MAR */}
      {latestEAR && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "#64748b" }}>EAR</span>
            <span style={{ color: "#3b82f6", fontFamily: "monospace" }}>
              {latestEAR}
            </span>
          </div>
          <div
            style={{
              height: "4px",
              background: "#1e2535",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(latestEAR * 200, 100)}%`,
                background: "#3b82f6",
                borderRadius: "2px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "#64748b" }}>MAR</span>
            <span style={{ color: "#f59e0b", fontFamily: "monospace" }}>
              {latestMAR}
            </span>
          </div>
          <div
            style={{
              height: "4px",
              background: "#1e2535",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(latestMAR * 200, 100)}%`,
                background: "#f59e0b",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertScore;
