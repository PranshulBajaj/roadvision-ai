import { NavLink } from 'react-router-dom'

const links = [
  { path: '/', icon: '🏠', label: 'Dashboard' },
  { path: '/reports', icon: '📄', label: 'Reports' },
  { path: '/profile', icon: '👤', label: 'Driver Profile' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
  { path: '/about', icon: 'ℹ️', label: 'About' },
]

function Sidebar() {
  return (
    <div style={{
      width: '220px',
      background: '#111620',
      borderRight: '1px solid #1e2535',
      minHeight: '100vh',
      padding: '20px 0',
      flexShrink: 0,
    }}>
      {links.map(link => (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.path === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            color: isActive ? '#3b82f6' : '#64748b',
            background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
            borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: isActive ? '600' : '400',
            transition: 'all 0.2s',
          })}
        >
          <span>{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar