import { useEffect, useRef } from 'react'

function LiveFeed({ onDrowsy, onYawn, onEarUpdate }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    let faceLandmarker
    let drowsyFrames = 0
    let yawnFrames = 0
    const DROWSY_THRESHOLD = 15
    const YAWN_THRESHOLD = 10

    async function sendAlert(type, earValue, marValue) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, earValue, marValue }),
      })
      if (type === 'DROWSY') onDrowsy()
      if (type === 'YAWN') onYawn()
    }

    async function init() {
      const { FaceLandmarker, FilesetResolver } = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/vision_bundle.js'
      )

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      )

      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      })

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      videoRef.current.addEventListener('loadeddata', detect)
    }

    function detect() {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const results = faceLandmarker.detectForVideo(video, performance.now())
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          const le = [33, 160, 158, 133, 153, 144].map(i => landmarks[i])
          const ear = (Math.abs(le[1].y - le[5].y) + Math.abs(le[2].y - le[4].y)) /
            (2 * Math.abs(le[0].x - le[3].x))

          const re = [362, 385, 387, 263, 373, 380].map(i => landmarks[i])
          const earRight = (Math.abs(re[1].y - re[5].y) + Math.abs(re[2].y - re[4].y)) /
            (2 * Math.abs(re[0].x - re[3].x))

          const avgEAR = ((ear + earRight) / 2).toFixed(3)

          const mo = [13, 14, 78, 308, 82, 312].map(i => landmarks[i])
          const mar = (Math.abs(mo[0].y - mo[1].y) / Math.abs(mo[2].x - mo[3].x)).toFixed(3)

          onEarUpdate(parseFloat(avgEAR), parseFloat(mar))

          // DROWSY
          if (avgEAR < 0.28) {
            drowsyFrames++
          } else {
            drowsyFrames = 0
          }

          if (drowsyFrames === DROWSY_THRESHOLD) {
            sendAlert('DROWSY', avgEAR, mar)
          }

          if (drowsyFrames > DROWSY_THRESHOLD) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'red'
            ctx.font = 'bold 36px Arial'
            ctx.fillText('⚠️ DROWSY!', 180, 240)
          }

          // YAWN
          if (mar > 0.5) {
            yawnFrames++
          } else {
            yawnFrames = 0
          }

          if (yawnFrames === YAWN_THRESHOLD) {
            sendAlert('YAWN', avgEAR, mar)
          }

          if (yawnFrames > YAWN_THRESHOLD) {
            ctx.fillStyle = 'rgba(255, 165, 0, 0.3)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'orange'
            ctx.font = 'bold 36px Arial'
            ctx.fillText('😴 YAWNING!', 180, 240)
          }
        }
      }
      requestAnimationFrame(detect)
    }

    init()
  }, [])

  return (
    <div style={{
      background: '#111620',
      border: '1px solid #1e2535',
      borderRadius: '8px',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '11px',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '600',
        marginBottom: '12px'
      }}>
        Live Camera Feed
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          autoPlay
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
        />
      </div>
    </div>
  )
}

export default LiveFeed