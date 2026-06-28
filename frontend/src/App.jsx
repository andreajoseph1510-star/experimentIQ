import { useState } from 'react'
import Navbar from './components/Navbar'
import ExperimentForm from './components/ExperimentForm'
import VerdictDisplay from './components/VerdictDisplay'
import MetricsGrid from './components/MetricsGrid'
import ConfidenceInterval from './components/ConfidenceInterval'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || 'Something went wrong')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8F2]">
      <Navbar />

      <div className="max-w-[1100px] mx-auto px-5 pt-6 pb-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        {/* Left panel */}
        <div className="space-y-3">
          <ExperimentForm onAnalyze={handleAnalyze} loading={loading} />
          {error && (
            <div className="bg-[#FF6B6B0D] border border-[#FF6B6B33] rounded-lg p-3 text-[12px] text-[#FF6B6B]">
              {error}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-3">
          <VerdictDisplay result={result} />
          <MetricsGrid result={result} />
          <ConfidenceInterval result={result} />
        </div>
      </div>
    </div>
  )
}

export default App