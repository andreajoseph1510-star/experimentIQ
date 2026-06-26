import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('❌ Could not reach backend'))
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#F8F8F2] mb-3">ExperimentIQ</h1>
        <p className="text-[#00D4AA] font-mono text-lg">Backend status: {status}</p>
      </div>
    </div>
  )
}

export default App