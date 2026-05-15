export default function SetInputRow({ placeholder }) {
  return (
    <label className="set-input-row">
      <span className="muted-label">Sarjat</span>
      <input placeholder={placeholder} />
      <span className="hint">Muoto: toistot/paino. Esim. 15/40 + 10/60 + 6/75.</span>
    </label>
  )
}
