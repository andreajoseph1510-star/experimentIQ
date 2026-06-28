import { motion, AnimatePresence } from 'framer-motion'

const verdictConfig = {
  'Ship B': { color: '#00D4AA', label: 'Ship B' },
  "Don't ship B": { color: '#FF6B6B', label: "Don't ship B" },
  'Effect too small': { color: '#FFB86C', label: 'Effect too small' },
  'Collect more data': { color: '#FFB86C', label: 'Collect more data' },
  'No signal': { color: '#555555', label: 'No signal' },
}

export default function VerdictDisplay({ result }) {
  const verdict = result?.verdict
  const config = verdictConfig[verdict] || { color: '#333333', label: 'Awaiting data' }

  const subtext = (() => {
    if (!result) return 'Enter experiment values and run analysis'
    switch (verdict) {
      case 'Ship B':
        return 'Statistically and practically significant uplift detected'
      case "Don't ship B":
        return 'B significantly underperforms control'
      case 'Effect too small':
        return 'Real difference detected — but below practical threshold'
      case 'Collect more data':
        return 'Promising uplift — insufficient statistical evidence'
      default:
        return 'No statistical or practical difference detected'
    }
  })()

  const pValueDisplay = result
    ? result.p_value < 0.0001
      ? '<.0001'
      : result.p_value.toFixed(4)
    : '—'

  return (
    <div
      className="relative overflow-hidden bg-[#12121A] border border-[#1E1E2E] rounded-lg px-6 py-5 flex items-center justify-between gap-5"
      style={{ '--verdict-color': config.color }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        animate={{ backgroundColor: config.color }}
        transition={{ duration: 0.4 }}
      />

      <div className="flex-1">
        <div className="text-[10px] font-semibold tracking-widest text-[#555] uppercase mb-1">
          Decision
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={verdict || 'empty'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[26px] font-semibold tracking-tight"
            style={{ color: config.color }}
          >
            {result ? config.label : 'Awaiting data'}
          </motion.div>
        </AnimatePresence>
        <div className="text-[12px] text-[#555] mt-1">{subtext}</div>
      </div>

      <div className="text-right">
        <div className="text-[10px] text-[#555] tracking-wider mb-0.5">P-VALUE</div>
        <div
          className="font-mono text-[28px] font-medium"
          style={{ color: config.color }}
        >
          {pValueDisplay}
        </div>
      </div>
    </div>
  )
}