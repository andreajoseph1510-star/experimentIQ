import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SampleSizePage() {
  const [form, setForm] = useState({
    baseline_rate: 6,
    mde: 20,
    alpha: 0.05,
    power: 0.8,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sample-size`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseline_rate: form.baseline_rate / 100,
          mde: form.mde / 100,
          alpha: form.alpha,
          power: form.power,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Calculation failed')
      }
      const data = await res.json()
      setResult(data.required_sample_size_per_group)
    } catch (err) {
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const mdeLevels = [5, 10, 15, 20, 30, 50]

  return (
    <div className="max-w-[1100px] mx-auto px-5 pt-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">

        {/* Left — inputs */}
        <div className="bg-[#12121A] border border-[#1E1E2E] rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1E1E2E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C6FCD] shadow-[0_0_6px_#7C6FCD88]" />
            <span className="text-[11px] font-semibold tracking-wider text-[#888] uppercase">
              Sample size calculator
            </span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-[#666]">Baseline conversion rate</span>
                <span className="font-mono text-[11px] text-[#00D4AA]">{form.baseline_rate}%</span>
              </div>
              <input
                type="range"
                min="1" max="50" step="0.5"
                value={form.baseline_rate}
                onChange={(e) => handleChange('baseline_rate', Number(e.target.value))}
                className="w-full accent-[#00D4AA]"
              />
              <div className="flex justify-between text-[10px] text-[#444] mt-0.5">
                <span>1%</span><span>50%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-[#666]">Min. detectable effect (relative)</span>
                <span className="font-mono text-[11px] text-[#00D4AA]">{form.mde}%</span>
              </div>
              <input
                type="range"
                min="1" max="100" step="1"
                value={form.mde}
                onChange={(e) => handleChange('mde', Number(e.target.value))}
                className="w-full accent-[#00D4AA]"
              />
              <div className="flex justify-between text-[10px] text-[#444] mt-0.5">
                <span>1%</span><span>100%</span>
              </div>
            </div>

            <hr className="border-[#1E1E2E]" />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-[#555] mb-1">Significance (α)</div>
                <select
                  value={form.alpha}
                  onChange={(e) => handleChange('alpha', Number(e.target.value))}
                  className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 text-[12px] text-[#F8F8F2] outline-none"
                >
                  <option value={0.05}>α = 0.05</option>
                  <option value={0.01}>α = 0.01</option>
                  <option value={0.10}>α = 0.10</option>
                </select>
              </div>
              <div>
                <div className="text-[10px] text-[#555] mb-1">Power</div>
                <select
                  value={form.power}
                  onChange={(e) => handleChange('power', Number(e.target.value))}
                  className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 text-[12px] text-[#F8F8F2] outline-none"
                >
                  <option value={0.8}>80%</option>
                  <option value={0.9}>90%</option>
                  <option value={0.95}>95%</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-2.5 bg-[#7C6FCD] hover:bg-[#9D93D8] disabled:opacity-50 text-white font-semibold text-[13px] rounded-md transition-all"
            >
              {loading ? 'Calculating...' : 'Calculate sample size'}
            </button>
          </div>
        </div>

        {/* Right — results */}
        <div className="space-y-3">

          {/* Main result */}
          <div className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#7C6FCD]" />
            <div className="text-[10px] text-[#555] font-semibold tracking-widest uppercase mb-1">
              Required per group
            </div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={result}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-[48px] font-semibold text-[#7C6FCD]"
                >
                  {result.toLocaleString()}
                </motion.div>
              ) : (
                <div className="font-mono text-[48px] font-semibold text-[#333]">—</div>
              )}
            </AnimatePresence>
            {result && (
              <div className="text-[13px] text-[#555] mt-1">
                Total: <span className="font-mono text-[#F8F8F2]">{(result * 2).toLocaleString()}</span> visitors across both groups
              </div>
            )}
            {error && (
              <div className="text-[12px] text-[#FF6B6B] mt-2">{error}</div>
            )}
          </div>

          {/* MDE comparison bars */}
          <div className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-4">
            <div className="text-[10px] text-[#555] font-semibold tracking-wider uppercase mb-3">
              Sample size vs MDE — how effect size changes your needs
            </div>
            <div className="space-y-2">
              {mdeLevels.map((mdeVal) => {
                const isActive = mdeVal === form.mde
                const barWidth = Math.max(4, Math.min(95, 100 / mdeVal * 3))
                return (
                  <div key={mdeVal} className="flex items-center gap-3">
                    <div className="text-[11px] font-mono text-[#555] w-8 text-right">{mdeVal}%</div>
                    <div className="flex-1 h-5 bg-[#1E1E2E] rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          background: isActive ? '#7C6FCD' : '#2A2A3E',
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-[#555] w-16 font-mono">
                      {mdeVal <= form.mde ? 'less data' : 'more data'}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-[11px] text-[#444] mt-3">
              Smaller MDE = harder to detect = exponentially more data needed
            </div>
          </div>

          {/* Key insight cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Baseline rate', value: `${form.baseline_rate}%` },
              { label: 'MDE', value: `${form.mde}%` },
              { label: 'Power', value: `${(form.power * 100).toFixed(0)}%` },
            ].map((item) => (
              <div key={item.label} className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-3">
                <div className="text-[10px] text-[#555] uppercase tracking-wider mb-1">{item.label}</div>
                <div className="font-mono text-lg text-[#F8F8F2]">{item.value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}