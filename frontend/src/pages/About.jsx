function About() {
  const tech = [
    { name: 'MediaPipe FaceLandmarker', role: 'Facial landmark detection (468 points)' },
    { name: 'React + Vite', role: 'Frontend dashboard' },
    { name: 'Node.js + Express', role: 'REST API backend' },
    { name: 'MongoDB Atlas', role: 'Alert storage' },
    { name: 'YOLOv11 (upcoming)', role: 'Face detection' },
    { name: 'MobileNetV2 (upcoming)', role: 'Drowsiness classification' },
  ]

  const team = [
    { name: 'Pranshul', roll: '04196302723' },
    { name: 'Mohit Kumar', roll: '044' },
    { name: 'Rajat Kr Singh', roll: '024' },
  ]

  const papers = [
    'Dewi et al. (2022) — EAR threshold 0.18, Electronics',
    'Fonseca & Ferreira (2025) — Systematic review, Applied Sciences',
    'Abe (2023) — PERCLOS limitations, Sleep Advances',
    'Hassan et al. (2026) — Edge processing, Springer',
    'Luwani et al. (2026) — EAR + MobileNetV2 97%, JEMLR',
  ]

  const card = {
    background: '#111620',
    border: '1px solid #1e2535',
    borderRadius: '8px',
    padding: '24px',
  }

  const label = {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600',
    marginBottom: '16px',
  }

  return (
    <div style={{ color: '#e2e8f0' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '22px' }}>About RoadVision AI</h2>

      {/* Project Info */}
      <div style={{ ...card, marginBottom: '20px' }}>
        <div style={label}>Project</div>
        <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#94a3b8' }}>
          RoadVision AI is a browser-native real-time driver drowsiness and yawning detection system
          that uses MediaPipe facial landmarks to compute Eye Aspect Ratio (EAR) and Mouth Aspect
          Ratio (MAR) without any specialized hardware or GPU. Alerts are logged to MongoDB and
          displayed on a live React dashboard.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Team */}
        <div style={card}>
          <div style={label}>Team</div>
          {team.map(m => (
            <div key={m.roll} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid #1e2535',
              fontSize: '14px'
            }}>
              <span>{m.name}</span>
              <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{m.roll}</span>
            </div>
          ))}
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
            Mentor: <span style={{ color: '#3b82f6' }}>Ms. Vaani Garg</span>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Institution: <span style={{ color: '#e2e8f0' }}>MSIT, New Delhi</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={card}>
          <div style={label}>Technology Stack</div>
          {tech.map(t => (
            <div key={t.name} style={{
              padding: '8px 0',
              borderBottom: '1px solid #1e2535',
              fontSize: '13px'
            }}>
              <div style={{ color: '#3b82f6', fontWeight: '600' }}>{t.name}</div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Papers */}
      <div style={card}>
        <div style={label}>Key Research Papers</div>
        {papers.map((p, i) => (
          <div key={i} style={{
            display: 'flex', gap: '12px', padding: '10px 0',
            borderBottom: '1px solid #1e2535', fontSize: '13px'
          }}>
            <span style={{ color: '#3b82f6', fontFamily: 'monospace', flexShrink: 0 }}>
              [{i + 1}]
            </span>
            <span style={{ color: '#94a3b8' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About