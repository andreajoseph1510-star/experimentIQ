import { useState, useEffect } from 'react'

export default function ExperimentsList() {
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchExperiments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/experiments`)
      if (!res.ok) throw new Error('Failed to load experiments')
      const data = await res.json()
      setExperiments(data.experiments)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiments()
  }, [])

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/experiment/${id}`, { method: 'DELETE' })
      setExperiments((prev) => prev.filter((exp) => exp.id !== id))
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  const verdictColor = (verdict) => {
    if (verdict === 'Ship B') return 'text-[#00D4AA]'
    if (verdict === "Don't ship B") return 'text-[#FF6B6B]'
    if (verdict === 'Effect too small' || verdict === 'Collect more data') return 'text-[#FFB86C]'
    return 'text-[#888]'
  }

  if (loading) {
    return <div className="text-[13px] text-[#555] text-center py-10">Loading experiments...</div>
  }

  if (error) {
    return <div className="text-[13px] text-[#FF6B6B] text-center py-10">{error}</div>
  }

  if (experiments.length === 0) {
    return (
      <div className="text-[13px] text-[#555] text-center py-16">
        No saved experiments yet. Run an analysis and save it to see it here.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {experiments.map((exp) => (
        <div
          key={exp.id}
          className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-4 flex items-center justify-between gap-4"
        >
          <div className="flex-1">
            <div className="text-[14px] font-medium text-[#F8F8F2]">{exp.name}</div>
            <div className="text-[11px] text-[#555] mt-0.5">
              {new Date(exp.created_at).toLocaleString()} · n={exp.n_a + exp.n_b} ·{' '}
              {(exp.rate_a * 100).toFixed(2)}% → {(exp.rate_b * 100).toFixed(2)}%
            </div>
          </div>
          <div className={`font-mono text-[13px] font-medium ${verdictColor(exp.verdict)}`}>
            {exp.verdict}
          </div>
          <button
            onClick={() => handleDelete(exp.id)}
            className="text-[11px] text-[#555] hover:text-[#FF6B6B] transition-colors px-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}