export default function ConfidenceInterval({ result }) {
  if (!result) {
    return (
      <div className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-4">
        <div className="text-[10px] text-[#555] font-semibold tracking-wider uppercase mb-2">
          95% confidence interval — B minus A
        </div>
        <div className="text-[12px] text-[#555]">Run an analysis to see results</div>
      </div>
    )
  }

  const { lower_bound, upper_bound, difference } = result.confidence_interval

  const range = Math.max(Math.abs(lower_bound), Math.abs(upper_bound)) * 2.4 || 0.01
  const mid = 50
  const lo = mid + (lower_bound / range) * 90
  const hi = mid + (upper_bound / range) * 90
  const pt = mid + (difference / range) * 90

  return (
    <div className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[10px] text-[#555] font-semibold tracking-wider uppercase">
          95% confidence interval — B minus A
        </div>
        <div className="font-mono text-[11px] text-[#666]">
          Δ = {(difference * 100).toFixed(2)}%
        </div>
      </div>

      <div className="relative h-2 bg-[#1E1E2E] rounded-full my-1.5">
        <div
          className="absolute h-full rounded-full bg-[#7C6FCD44] border border-[#7C6FCD66] transition-all duration-500"
          style={{
            left: `${Math.max(0, lo)}%`,
            width: `${Math.max(0, Math.min(100, hi) - Math.max(0, lo))}%`,
          }}
        />
        <div
          className="absolute -top-1 -bottom-1 w-[1.5px] bg-[#555] rounded"
          style={{ left: `${Math.max(0, Math.min(97, mid))}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#7C6FCD] border-2 border-[#0A0A0F] transition-all duration-500"
          style={{ left: `${Math.max(2, Math.min(98, pt))}%` }}
        />
      </div>

      <div className="flex justify-between font-mono text-[10px] text-[#555] mt-1">
        <span>{(lower_bound * 100).toFixed(2)}%</span>
        <span>B − A</span>
        <span>{(upper_bound * 100).toFixed(2)}%</span>
      </div>
    </div>
  )
}