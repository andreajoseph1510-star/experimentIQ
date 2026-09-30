export default function Navbar({ view, setView, session, onSignOut }) {
  return (
    <nav className="flex items-center justify-between px-7 h-[52px] border-b border-[#1E1E2E] bg-[#0A0A0F]">
      <div className="font-mono text-sm font-semibold text-[#00D4AA] tracking-wide">
        ExperimentIQ
      </div>

      <div className="flex gap-0.5">
        {['analyzer', 'experiments', 'sample-size'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-[12px] px-3 py-1 rounded-md font-medium transition-colors ${
              view === v
                ? 'bg-[#1E1E2E] text-[#F8F8F2]'
                : 'text-[#888] hover:text-[#ccc]'
            }`}
          >
            {v === 'sample-size' ? 'Sample Size' : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {session && (
          <div className="flex items-center gap-2">
            <img
              src={session.user.user_metadata?.avatar_url}
              alt="avatar"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-[11px] text-[#555]">
              {session.user.user_metadata?.full_name?.split(' ')[0]}
            </span>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="text-[11px] text-[#555] hover:text-[#FF6B6B] transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}