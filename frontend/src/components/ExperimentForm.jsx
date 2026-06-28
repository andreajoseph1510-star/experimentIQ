import { useState } from 'react'

export default function ExperimentForm({ onAnalyze, loading }) {
  const [form, setForm] = useState({
    n_a: 5000,
    c_a: 300,
    n_b: 5000,
    c_b: 370,
    alpha: 0.05,
    tails: 2,
    mde: 0.02,
  })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAnalyze(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#12121A] border border-[#1E1E2E] rounded-lg overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1E1E2E]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] shadow-[0_0_6px_#00D4AA88]" />
        <span className="text-[11px] font-semibold tracking-wider text-[#888] uppercase">
          Experiment config
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Control group A */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-[#666] font-medium tracking-wide">
              Control group
            </span>
            <span className="font-mono text-[10px] text-[#00D4AA] bg-[#00D4AA1A] px-1.5 py-0.5 rounded">
              A
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-[#555] mb-1">Visitors</div>
              <input
                type="number"
                value={form.n_a}
                onChange={(e) => handleChange('n_a', Number(e.target.value))}
                className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 font-mono text-[13px] text-[#F8F8F2] outline-none focus:border-[#00D4AA88] transition-colors"
              />
            </div>
            <div>
              <div className="text-[10px] text-[#555] mb-1">Conversions</div>
              <input
                type="number"
                value={form.c_a}
                onChange={(e) => handleChange('c_a', Number(e.target.value))}
                className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 font-mono text-[13px] text-[#F8F8F2] outline-none focus:border-[#00D4AA88] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Treatment group B */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-[#666] font-medium tracking-wide">
              Treatment group
            </span>
            <span className="font-mono text-[10px] text-[#00D4AA] bg-[#00D4AA1A] px-1.5 py-0.5 rounded">
              B
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-[#555] mb-1">Visitors</div>
              <input
                type="number"
                value={form.n_b}
                onChange={(e) => handleChange('n_b', Number(e.target.value))}
                className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 font-mono text-[13px] text-[#F8F8F2] outline-none focus:border-[#00D4AA88] transition-colors"
              />
            </div>
            <div>
              <div className="text-[10px] text-[#555] mb-1">Conversions</div>
              <input
                type="number"
                value={form.c_b}
                onChange={(e) => handleChange('c_b', Number(e.target.value))}
                className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 font-mono text-[13px] text-[#F8F8F2] outline-none focus:border-[#00D4AA88] transition-colors"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#1E1E2E]" />

        {/* Test parameters */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] text-[#555] mb-1">Significance (α)</div>
            <select
              value={form.alpha}
              onChange={(e) => handleChange('alpha', Number(e.target.value))}
              className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 text-[12px] text-[#F8F8F2] outline-none cursor-pointer"
            >
              <option value={0.05}>α = 0.05</option>
              <option value={0.01}>α = 0.01</option>
              <option value={0.10}>α = 0.10</option>
            </select>
          </div>
          <div>
            <div className="text-[10px] text-[#555] mb-1">Tails</div>
            <select
              value={form.tails}
              onChange={(e) => handleChange('tails', Number(e.target.value))}
              className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 text-[12px] text-[#F8F8F2] outline-none cursor-pointer"
            >
              <option value={2}>Two-tailed</option>
              <option value={1}>One-tailed</option>
            </select>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#555] mb-1">Min. detectable effect (%)</div>
          <input
            type="number"
            step="0.5"
            value={form.mde * 100}
            onChange={(e) => handleChange('mde', Number(e.target.value) / 100)}
            className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 font-mono text-[13px] text-[#F8F8F2] outline-none focus:border-[#00D4AA88] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#00D4AA] hover:bg-[#00FFCC] disabled:opacity-50 disabled:cursor-not-allowed text-[#0A0A0F] font-semibold text-[13px] rounded-md transition-all"
        >
          {loading ? 'Analyzing...' : 'Run analysis'}
        </button>
      </div>
    </form>
  )
}