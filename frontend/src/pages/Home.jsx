import Stats from "../components/Stats";
import AlertScore from "../components/AlertScore";
import EarGraph from "../components/EarGraph";
import AlertLog from "../components/AlertLog";

function Home({ alerts, earData, perclos, headPose, videoRef, canvasRef, aiResult }) {
  return (
    <>
      <Stats alerts={alerts} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "16px",
            }}
          >
            {/* Camera display only */}
            <div
              style={{
                background: "#111620",
                border: "1px solid #1e2535",
                borderRadius: "8px",
                padding: "20px",
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
                Live Camera Feed
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/3",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            <AlertScore
              alerts={alerts}
              earData={earData}
              perclos={perclos}
              headPose={headPose}
            />
          </div>
          <EarGraph earData={earData} />
        </div>

        {/* Right */}
        <AlertLog alerts={alerts} />
      </div>
      {/* AI Result Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          background: "#111620",
          border: "1px solid #1e2535",
          borderRadius: "8px",
          padding: "12px 20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: "600",
          }}
        >
          YOLOv11 
        </div>

        <div
          style={{
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
            background:
              aiResult.status === "DROWSY"
                ? "rgba(239,68,68,0.15)"
                : aiResult.status === "YAWN"
                  ? "rgba(245,158,11,0.15)"
                  : "rgba(34,197,94,0.15)",
            color:
              aiResult.status === "DROWSY"
                ? "#ef4444"
                : aiResult.status === "YAWN"
                  ? "#f59e0b"
                  : "#22c55e",
          }}
        >
          {aiResult.status === "DROWSY"
            ? "😴 DROWSY"
            : aiResult.status === "YAWN"
              ? "🥱 YAWNING"
              : "✅ ALERT"}
        </div>

        {aiResult.yolo_face_detected && (
          <>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              EAR:{" "}
              <span style={{ color: "#3b82f6", fontFamily: "monospace" }}>
                {aiResult.ear}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              MAR:{" "}
              <span style={{ color: "#f59e0b", fontFamily: "monospace" }}>
                {aiResult.mar}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Confidence:{" "}
              <span style={{ color: "#22c55e", fontFamily: "monospace" }}>
                {(aiResult.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </>
        )}

        {!aiResult.yolo_face_detected && (
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            No face detected
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
