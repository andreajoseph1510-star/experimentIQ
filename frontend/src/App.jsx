import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabase'
import Navbar from './components/Navbar'
import ExperimentForm from './components/ExperimentForm'
import VerdictDisplay from './components/VerdictDisplay'
import MetricsGrid from './components/MetricsGrid'
import ConfidenceInterval from './components/ConfidenceInterval'
import SaveExperimentButton from './components/SaveExperimentButton'
import ExperimentsList from './components/ExperimentsList'
import SampleSizePage from './components/SampleSizePage'
import SignificanceBadges from './components/SignificanceBadges'
import LoginPage from './components/LoginPage'

function App() {
  const [session, setSession] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [view, setView] = useState('analyzer')
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingAuth(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setResult(null)
    setFormData(null)
  }

  const handleAnalyze = async (data) => {
    setLoading(true)
    setError(null)
    setFormData(data)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || 'Something went wrong')
      }
      const resultData = await res.json()
      setResult(resultData)
    } catch (err) {
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  // Show nothing while checking auth
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="font-mono text-[#00D4AA] text-sm">Loading...</div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!session) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8F8F2]">
      <Navbar view={view} setView={setView} session={session} onSignOut={handleSignOut} />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'analyzer' ? (
            <div className="max-w-[1100px] mx-auto px-5 pt-6 pb-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
              <div className="space-y-3">
                <ExperimentForm onAnalyze={handleAnalyze} loading={loading} />
                {error && (
                  <div className="bg-[#FF6B6B0D] border border-[#FF6B6B33] rounded-lg p-3 text-[12px] text-[#FF6B6B]">
                    {error}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <VerdictDisplay result={result} />
                <MetricsGrid result={result} />
                <SignificanceBadges result={result} />
                <ConfidenceInterval result={result} />
                <SaveExperimentButton result={result} formData={formData} session={session} />
              </div>
            </div>
          ) : view === 'experiments' ? (
            <div className="max-w-[1100px] mx-auto px-5 pt-6 pb-10">
              <h2 className="text-[18px] font-semibold mb-4">Saved experiments</h2>
              <ExperimentsList session={session} />
            </div>
          ) : (
            <SampleSizePage />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App