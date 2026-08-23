function Stats({ alerts }) {
  const drowsyCount = alerts.filter(a => a.type === 'DROWSY').length
  const yawnCount = alerts.filter(a => a.type === 'YAWN').length
  const lastAlert = alerts[0]?.timestamp
    ? new Date(alerts[0].timestamp).toLocaleTimeString()
    : 'None'

  const cardStyle = {
    background: '#111620',
    border: '1px solid #1e2535',
    padding: '20px 24px',
    flex: 1,
  }

  const labelStyle = {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: '600',
  }

  const valueStyle = {
    fontSize: '28px',
    fontWeight: '600',
    fontFamily: 'monospace',
    marginTop: '4px',
  }

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #1e2535' }}>
      <div style={cardStyle}>
        <div style={labelStyle}>Drowsy Events</div>
        <div style={{ ...valueStyle, color: '#ef4444' }}>{drowsyCount}</div>
      </div>
      <div style={{ ...cardStyle, borderLeft: '1px solid #1e2535' }}>
        <div style={labelStyle}>Yawn Events</div>
        <div style={{ ...valueStyle, color: '#f59e0b' }}>{yawnCount}</div>
      </div>
      <div style={{ ...cardStyle, borderLeft: '1px solid #1e2535' }}>
        <div style={labelStyle}>Last Alert</div>
        <div style={{ ...valueStyle, color: '#3b82f6', fontSize: '18px', marginTop: '8px' }}>{lastAlert}</div>
      </div>
      <div style={{ ...cardStyle, borderLeft: '1px solid #1e2535' }}>
        <div style={labelStyle}>Total Alerts</div>
        <div style={{ ...valueStyle, color: '#22c55e' }}>{alerts.length}</div>
      </div>
    </div>
  )
}

export default Stats