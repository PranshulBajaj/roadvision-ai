import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, Legend } from 'recharts'

function EarGraph({ earData }) {
  return (
    <div style={{
      background: '#111620',
      border: '1px solid #1e2535',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '24px',
    }}>
      <div style={{
        fontSize: '11px',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '600',
        marginBottom: '12px'
      }}>
        EAR & MAR Live Graph
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={earData}>
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
          <YAxis domain={[0, 0.6]} tick={{ fill: '#64748b', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: '#111620', border: '1px solid #1e2535', color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ color: '#64748b', fontSize: '11px' }} />
          <ReferenceLine y={0.28} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'EAR threshold', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={0.5} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'MAR threshold', fill: '#f59e0b', fontSize: 10 }} />
          <Line type="monotone" dataKey="ear" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} name="EAR" />
          <Line type="monotone" dataKey="mar" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} name="MAR" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EarGraph