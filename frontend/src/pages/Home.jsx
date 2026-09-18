import Stats from '../components/Stats'
import LiveFeed from '../components/LiveFeed'
import AlertScore from '../components/AlertScore'
import EarGraph from '../components/EarGraph'
import AlertLog from '../components/AlertLog'

function Home({ alerts, earData, fetchAlerts, handleEarUpdate, perclos, setPerclos, headPose, setHeadPose }) {
  return (
    <>
      <Stats alerts={alerts} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <LiveFeed
              onDrowsy={fetchAlerts}
              onYawn={fetchAlerts}
              onEarUpdate={handleEarUpdate}
              onPerclosUpdate={setPerclos}
              onHeadPose={setHeadPose}
            />
            <AlertScore
              alerts={alerts}
              earData={earData}
              perclos={perclos}
              headPose={headPose}
            />
          </div>
          <EarGraph earData={earData} />
        </div>

        {/* Right */}
        <AlertLog alerts={alerts} />
      </div>
    </>
  )
}

export default Home