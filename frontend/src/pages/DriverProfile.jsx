import { useState } from 'react'

function DriverProfile() {
  const [profile, setProfile] = useState({
    name: 'Pranshul',
    age: '21',
    license: 'DL-0420110012345',
    vehicle: 'Swift Dzire',
    phone: '+91 9999999999',
    email: 'pranshul@example.com',
    experience: '2 years',
  })

  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState(profile)

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

  const inputStyle = {
    background: '#0a0d14',
    border: '1px solid #1e2535',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#e2e8f0',
    fontSize: '14px',
    width: '100%',
  }

  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'age', label: 'Age' },
    { key: 'license', label: 'License Number' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'experience', label: 'Driving Experience' },
  ]

  const handleSave = () => {
    setProfile(temp)
    setEditing(false)
  }

  return (
    <div style={{ color: '#e2e8f0' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '22px' }}>Driver Profile</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>

        {/* Avatar Card */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '100px', height: '100px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px', fontWeight: '700',
          }}>
            {profile.name.charAt(0)}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>{profile.name}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Driver</div>
          </div>
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#22c55e',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            🟢 Active
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            MSIT, New Delhi
          </div>
        </div>

        {/* Info Card */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={label}>Driver Information</div>
            {!editing ? (
              <button onClick={() => setEditing(true)} style={{
                background: '#3b82f6', color: 'white',
                border: 'none', borderRadius: '6px',
                padding: '6px 16px', cursor: 'pointer', fontSize: '13px'
              }}>
                Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSave} style={{
                  background: '#22c55e', color: 'white',
                  border: 'none', borderRadius: '6px',
                  padding: '6px 16px', cursor: 'pointer', fontSize: '13px'
                }}>
                  Save
                </button>
                <button onClick={() => setEditing(false)} style={{
                  background: '#1e2535', color: '#e2e8f0',
                  border: 'none', borderRadius: '6px',
                  padding: '6px 16px', cursor: 'pointer', fontSize: '13px'
                }}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {fields.map(f => (
              <div key={f.key}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {f.label}
                </div>
                {editing ? (
                  <input
                    style={inputStyle}
                    value={temp[f.key]}
                    onChange={e => setTemp({ ...temp, [f.key]: e.target.value })}
                  />
                ) : (
                  <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{profile[f.key]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverProfile