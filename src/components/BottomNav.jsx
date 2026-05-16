const items = [
  { id: 'home', label: 'Tänään' },
  { id: 'workout', label: 'Treeni' },
  { id: 'history', label: 'Historia' },
  { id: 'progress', label: 'Kehitys' },
  { id: 'program', label: 'Ohjelma' },
  { id: 'settings', label: 'Asetukset' },
]

export default function BottomNav({ activeView, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Päänavigaatio">
      <div className="bottom-nav__inner">
        {items.map((item) => (
          <button
            aria-current={activeView === item.id ? 'page' : undefined}
            className="bottom-nav__item"
            key={item.id}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
