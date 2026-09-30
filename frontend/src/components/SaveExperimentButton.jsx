import { useState } from 'react'
import { supabase } from '../supabase'

export default function SaveExperimentButton({ result, formData, session }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a name for this experiment')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase.from('experiments').insert({
        user_id: session.user.id,
        name,
        n_a: formData.n_a,
        c_a: formData.c_a,
        n_b: formData.n_b,
        c_b: formData.c_b,
        alpha: formData.alpha,
        tails: formData.tails,
        mde: formData.mde,
        rate_a: result.rate_a,
        rate_b: result.rate_b,
        uplift: result.uplift,
        p_value: result.p_value,
        verdict: result.verdict,
      })
      if (error) throw error
      setSaved(true)
      setName('')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!result) return null

  return (
    <div className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-3.5">
      <div className="text-[10px] text-[#555] font-semibold tracking-wider uppercase mb-2">
        Save this experiment
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. Homepage CTA test"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-[#1E1E2E] border border-[#2A2A3E] rounded-md px-2.5 py-2 text-[13px] text-[#F8F8F2] outline-none focus:border-[#00D4AA88] transition-colors"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] disabled:opacity-50 text-[#F8F8F2] text-[12px] font-medium rounded-md transition-colors whitespace-nowrap"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
      {error && <div className="text-[11px] text-[#FF6B6B] mt-2">{error}</div>}
    </div>
  )
}