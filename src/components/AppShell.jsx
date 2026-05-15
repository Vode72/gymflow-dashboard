import BottomNav from './BottomNav'

export default function AppShell({ activeView, children, onNavigate, title }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-brand">
            <div className="app-brand__mark" aria-hidden="true">GF</div>
            <div className="app-brand__copy">
              <div className="app-brand__topline">
                <p className="app-brand__name">GymFlow™ Dashboard</p>
                <span className="app-brand__status">Demo</span>
              </div>
              <p className="app-brand__meta">
                <span>{title}</span>
                <span className="app-brand__separator"> · </span>
                <span className="app-brand__maker">Made by Toni V</span>
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
      <BottomNav activeView={activeView} onNavigate={onNavigate} />
    </div>
  )
}
