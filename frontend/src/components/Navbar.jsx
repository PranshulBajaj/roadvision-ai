import { useNavigate } from 'react-router-dom'

function Navbar({ onNewRide }) {
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
      <button
        onClick={onNewRide}
        style={{
          background: '#22c55e',
          color: 'white', border: 'none',
          borderRadius: '20px', padding: '6px 16px',
          fontSize: '12px', fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        🚗 Start New Ride
      </button>
    </nav>
  )
}

export default Navbar