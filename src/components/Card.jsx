export default function Card({ children, className = '', tone = 'default' }) {
  const toneClass = tone === 'accent' ? 'card--accent' : tone === 'flat' ? 'card--flat' : ''
  return (
    <section className={`card ${toneClass} ${className}`.trim()}>
      <div className="card__body">{children}</div>
    </section>
  )
}
