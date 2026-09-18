import Stats from '../components/Stats'
import AlertScore from '../components/AlertScore'
import EarGraph from '../components/EarGraph'
import AlertLog from '../components/AlertLog'

function Home({ alerts, earData, perclos, headPose, videoRef, canvasRef }) {
  return (
    <>
      <Stats alerts={alerts} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            
            {/* Camera display only */}
            <div style={{
              background: '#111620',
              border: '1px solid #1e2535',
              borderRadius: '8px',
              padding: '20px',
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '12px' }}>
                Live Camera Feed
              </div>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                <video ref={videoRef} autoPlay style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }} />
                <canvas ref={canvasRef} width={640} height={480} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }} />
              </div>
            </div>

            <AlertScore alerts={alerts} earData={earData} perclos={perclos} headPose={headPose} />
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