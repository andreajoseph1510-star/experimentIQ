export default function Navbar({ view, setView }) {
  return (
    <nav className="flex items-center justify-between px-7 h-[52px] border-b border-[#1E1E2E] bg-[#0A0A0F]">
      <div className="font-mono text-sm font-semibold text-[#00D4AA] tracking-wide">
        STAT<span className="text-[#F8F8F2] opacity-40">/</span>FRAME
      </div>

      <div className="flex gap-0.5">
        <button
          onClick={() => setView('analyzer')}
          className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors ${
            view === 'analyzer' ? 'bg-[#1E1E2E] text-[#F8F8F2]' : 'text-[#888] hover:text-[#ccc]'
          }`}
        >
          Analyzer
        </button>
        <button
          onClick={() => setView('experiments')}
          className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors ${
            view === 'experiments' ? 'bg-[#1E1E2E] text-[#F8F8F2]' : 'text-[#888] hover:text-[#ccc]'
          }`}
        >
          Experiments
        </button>
      </div>

      <div className="font-mono text-[10px] text-[#00D4AA] border border-[#00D4AA33] px-2 py-0.5 rounded tracking-widest">
        v1.0.0
      </div>
    </nav>
  )
}