import BottomNav from './BottomNav'

export default function AppShell({ activeView, children, onNavigate, title }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand app-brand">
            <div className="app-brand__mark" aria-hidden="true">GF</div>
            <div className="app-brand__copy">
              <div className="app-brand__topline">
                <p className="app-brand__name">GymFlow™ Dashboard</p>
              </div>
              <p className="app-brand__meta">
                <span className="app-brand__maker">Made by Toni V</span>
              </p>
            </div>
          </div>
          <p className="app-header__page-title">{title}</p>
          <div className="app-header__status">
            <span className="app-brand__status">Demo</span>
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
      <BottomNav activeView={activeView} onNavigate={onNavigate} />
    </div>
  )
}
