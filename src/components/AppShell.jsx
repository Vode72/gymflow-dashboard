import BottomNav from './BottomNav'

export default function AppShell({ activeView, children, onNavigate, title }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <p className="app-kicker">GymFlow Dashboard</p>
          <h1>{title}</h1>
        </div>
      </header>
      <main className="page">{children}</main>
      <BottomNav activeView={activeView} onNavigate={onNavigate} />
    </div>
  )
}
