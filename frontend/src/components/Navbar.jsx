function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 28px',
      background: '#111620',
      borderBottom: '1px solid #1e2535',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '10px', height: '10px',
          background: '#3b82f6',
          borderRadius: '50%',
          boxShadow: '0 0 10px #3b82f6'
        }}></div>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>
          RoadVision AI
        </span>
      </div>
      <div style={{
        background: 'rgba(34,197,94,0.1)',
        border: '1px solid rgba(34,197,94,0.3)',
        color: '#22c55e',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        🟢 LIVE MONITORING
      </div>
    </nav>
  )
}

export default Navbar