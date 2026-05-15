export default function WorkoutDayPicker({ days, selectedId, onSelect }) {
  return (
    <div className="workout-day-picker">
      {days.map((day) => (
        <button
          aria-pressed={selectedId === day.id}
          key={day.id}
          onClick={() => onSelect(day.id)}
          type="button"
        >
          <strong>{day.name}</strong>
          <span className="hint">{day.description}</span>
        </button>
      ))}
    </div>
  )
}
