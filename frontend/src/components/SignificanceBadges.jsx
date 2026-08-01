export default function SignificanceBadges({ result }) {
  if (!result) return null

  const badges = [
    {
      label: 'Statistical',
      pass: result.statistically_significant,
      value: result.statistically_significant ? 'Significant' : 'Not significant',
      detail: `p = ${result.p_value < 0.0001 ? '<0.0001' : result.p_value.toFixed(4)}`,
    },
    {
      label: 'Practical',
      pass: result.practically_significant,
      value: result.practically_significant ? 'Significant' : 'Not significant',
      detail: `uplift = ${(result.uplift * 100).toFixed(1)}%`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`rounded-lg p-3 border ${
            badge.pass
              ? 'bg-[#00D4AA0D] border-[#00D4AA22]'
              : 'bg-[#FF6B6B0D] border-[#FF6B6B22]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-2 h-2 rounded-full ${
                badge.pass
                  ? 'bg-[#00D4AA] shadow-[0_0_6px_#00D4AA88]'
                  : 'bg-[#FF6B6B] shadow-[0_0_6px_#FF6B6B88]'
              }`}
            />
            <span className="text-[11px] font-semibold text-[#888] tracking-wide">
              {badge.label}
            </span>
          </div>
          <div
            className={`text-[13px] font-medium ${
              badge.pass ? 'text-[#00D4AA]' : 'text-[#FF6B6B]'
            }`}
          >
            {badge.value}
          </div>
          <div className="text-[11px] text-[#555] font-mono mt-0.5">{badge.detail}</div>
        </div>
      ))}
    </div>
  )
}