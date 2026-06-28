export default function MetricsGrid({ result }) {
  const metrics = [
    {
      label: 'Rate A',
      value: result ? (result.rate_a * 100).toFixed(2) + '%' : '—',
      sub: 'Control',
    },
    {
      label: 'Rate B',
      value: result ? (result.rate_b * 100).toFixed(2) + '%' : '—',
      sub: 'Treatment',
    },
    {
      label: 'Uplift',
      value: result
        ? (result.uplift >= 0 ? '+' : '') + (result.uplift * 100).toFixed(1) + '%'
        : '—',
      sub: 'Relative change',
      colorClass: result
        ? result.uplift > 0
          ? 'text-[#00D4AA]'
          : result.uplift < 0
          ? 'text-[#FF6B6B]'
          : ''
        : '',
    },
    {
      label: 'Effect size',
      value: result ? result.effect_size_cohens_h.toFixed(3) : '—',
      sub: "Cohen's h",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-3.5"
        >
          <div className="text-[10px] text-[#555] font-semibold tracking-wider uppercase mb-1.5">
            {m.label}
          </div>
          <div className={`font-mono text-xl font-medium text-[#F8F8F2] ${m.colorClass || ''}`}>
            {m.value}
          </div>
          <div className="text-[11px] text-[#555] mt-0.5">{m.sub}</div>
        </div>
      ))}
    </div>
  )
}