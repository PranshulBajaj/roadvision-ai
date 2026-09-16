import { useState } from 'react'

function Settings() {
  const [settings, setSettings] = useState({
    earThreshold: 0.28,
    marThreshold: 0.5,
    drowsyFrames: 40,
    yawnFrames: 30,
    soundAlert: true,
    autoReset: false,
    refreshInterval: 3,
  })

  const [saved, setSaved] = useState(false)

  const card = {
    background: '#111620',
    border: '1px solid #1e2535',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px',
  }

  const label = {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600',
    marginBottom: '16px',
  }

  const inputStyle = {
    background: '#0a0d14',
    border: '1px solid #1e2535',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#e2e8f0',
    fontSize: '14px',
    width: '120px',
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ value, onChange }) => (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: '44px', height: '24px',
        background: value ? '#3b82f6' : '#1e2535',
        borderRadius: '12px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: '18px', height: '18px',
        background: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: '3px',
        left: value ? '23px' : '3px',
        transition: 'left 0.2s',
      }} />
    </div>
  )

  return (
    <div style={{ color: '#e2e8f0' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '22px' }}>Settings</h2>

      {/* Detection Settings */}
      <div style={card}>
        <div style={label}>Detection Thresholds</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {[
            { key: 'earThreshold', label: 'EAR Threshold', desc: 'Eye closed below this value' },
            { key: 'marThreshold', label: 'MAR Threshold', desc: 'Mouth open above this value' },
            { key: 'drowsyFrames', label: 'Drowsy Frames', desc: 'Frames before DROWSY alert' },
            { key: 'yawnFrames', label: 'Yawn Frames', desc: 'Frames before YAWN alert' },
          ].map(f => (
            <div key={f.key}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{f.label}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{f.desc}</div>
              <input
                type="number"
                step="0.01"
                style={inputStyle}
                value={settings[f.key]}
                onChange={e => setSettings({ ...settings, [f.key]: parseFloat(e.target.value) })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Alert Settings */}
      <div style={card}>
        <div style={label}>Alert Settings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'soundAlert', label: 'Sound Alert', desc: 'Play sound when drowsiness detected' },
            { key: 'autoReset', label: 'Auto Reset Session', desc: 'Reset alert count every hour' },
          ].map(f => (
            <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{f.label}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{f.desc}</div>
              </div>
              <Toggle
                value={settings[f.key]}
                onChange={val => setSettings({ ...settings, [f.key]: val })}
              />
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>Dashboard Refresh Interval</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Seconds between alert fetches</div>
            </div>
            <input
              type="number"
              style={inputStyle}
              value={settings.refreshInterval}
              onChange={e => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          background: saved ? '#22c55e' : '#3b82f6',
          color: 'white', border: 'none',
          borderRadius: '8px', padding: '12px 32px',
          fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', transition: 'background 0.3s',
        }}
      >
        {saved ? '✅ Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}

export default Settings