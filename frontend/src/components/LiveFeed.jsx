import { useEffect } from "react";

function LiveFeed({
  videoRef,
  canvasRef,
  onDrowsy,
  onYawn,
  onEarUpdate,
  onPerclosUpdate,
  onHeadPose,
  onAIResult,
}) {
  let totalFrames = 0;
  let closedFrames = 0;

  useEffect(() => {
    let faceLandmarker;
    let drowsyFrames = 0;
    let yawnFrames = 0;
    const DROWSY_THRESHOLD = 15;
    const YAWN_THRESHOLD = 10;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    async function sendAlert(type, earValue, marValue) {
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = type === "DROWSY" ? 880 : 660;
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 800);

      // API call
      await fetch(`${import.meta.env.VITE_API_URL}/api/alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, earValue, marValue }),
      });

      if (type === "DROWSY") onDrowsy();
      if (type === "YAWN") onYawn();
    }

    async function init() {
      const { FaceLandmarker, FilesetResolver } =
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/vision_bundle.js");

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", detect);
    }
    let aiFrameCount =0;
    function detect() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const results = faceLandmarker.detectForVideo(video, performance.now());
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          const le = [33, 160, 158, 133, 153, 144].map((i) => landmarks[i]);
          const ear =
            (Math.abs(le[1].y - le[5].y) + Math.abs(le[2].y - le[4].y)) /
            (2 * Math.abs(le[0].x - le[3].x));

          const re = [362, 385, 387, 263, 373, 380].map((i) => landmarks[i]);
          const earRight =
            (Math.abs(re[1].y - re[5].y) + Math.abs(re[2].y - re[4].y)) /
            (2 * Math.abs(re[0].x - re[3].x));

          const avgEAR = ((ear + earRight) / 2).toFixed(3);

          // PERCLOS calculation
          totalFrames++;
          if (avgEAR < 0.28) closedFrames++;
          const perclos =
            totalFrames > 0
              ? ((closedFrames / totalFrames) * 100).toFixed(1)
              : 0;
          onPerclosUpdate(parseFloat(perclos));

          const mo = [13, 14, 78, 308, 82, 312].map((i) => landmarks[i]);
          const mar = (
            Math.abs(mo[0].y - mo[1].y) / Math.abs(mo[2].x - mo[3].x)
          ).toFixed(3);

          // Head Pose Detection
          const nose = landmarks[1];
          const leftEar = landmarks[234];
          const rightEar = landmarks[454];
          const foreHead = landmarks[10];
          const chin = landmarks[152];

          // Horizontal tilt
          const horizontalRatio =
            (nose.x - leftEar.x) / (rightEar.x - leftEar.x);
          // Vertical tilt
          const verticalRatio = (nose.y - foreHead.y) / (chin.y - foreHead.y);

          let headPose = "Forward";
          if (horizontalRatio < 0.35) headPose = "Looking Right";
          else if (horizontalRatio > 0.65) headPose = "Looking Left";
          else if (verticalRatio < 0.45) headPose = "Looking Up";
          else if (verticalRatio > 0.65) headPose = "Looking Down";

          onHeadPose(headPose);

          onEarUpdate(parseFloat(avgEAR), parseFloat(mar));

          // DROWSY
          if (avgEAR < 0.28) {
            drowsyFrames++;
          } else {
            drowsyFrames = 0;
          }

          if (drowsyFrames === DROWSY_THRESHOLD) {
            sendAlert("DROWSY", avgEAR, mar);
          }

          if (drowsyFrames > DROWSY_THRESHOLD) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "red";
            ctx.font = "bold 36px Arial";
            ctx.fillText("⚠️ DROWSY!", 180, 240);
          }

          // YAWN
          if (mar > 0.5) {
            yawnFrames++;
          } else {
            yawnFrames = 0;
          }

          if (yawnFrames === YAWN_THRESHOLD) {
            sendAlert("YAWN", avgEAR, mar);
          }

          if (yawnFrames > YAWN_THRESHOLD) {
            ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "orange";
            ctx.font = "bold 36px Arial";
            ctx.fillText("😴 YAWNING!", 180, 240);
          }

          if (drowsyFrames > DROWSY_THRESHOLD && drowsyFrames % 90 === 0) {
            // Har 3 sec pe sound bajao
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.3;
            oscillator.start();
            setTimeout(() => oscillator.stop(), 800);
          }
        }
      }

      aiFrameCount++;

      // Har 15 frames pe AI service ko bhejo
      if (aiFrameCount % 15 === 0) {
        sendFrameToAI(canvas, video);
      }

      requestAnimationFrame(detect);
    }

    async function sendFrameToAI(canvas, video) {
      // Canvas pe video frame draw karo
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 640;
      tempCanvas.height = 480;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(video, 0, 0, 640, 480);

      // Canvas to blob
      tempCanvas.toBlob(
        async (blob) => {
          const formData = new FormData();
          formData.append("file", blob, "frame.jpg");

          const res = await fetch("http://localhost:8000/detect", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          console.log("AI Result:", data);

          // Agar YOLO ne face detect kiya
          if (data.yolo_face_detected) {
            onAIResult(data);
          }
        },
        "image/jpeg",
        0.8,
      );
    }

    init();
  }, []);

  return null;
}

export default LiveFeed;
