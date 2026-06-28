export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-7 h-[52px] border-b border-[#1E1E2E] bg-[#0A0A0F]">
      <div className="font-mono text-sm font-semibold text-[#00D4AA] tracking-wide">
        STAT<span className="text-[#F8F8F2] opacity-40">/</span>FRAME
      </div>
      <div className="font-mono text-[10px] text-[#00D4AA] border border-[#00D4AA33] px-2 py-0.5 rounded tracking-widest">
        v1.0.0
      </div>
    </nav>
  )
}