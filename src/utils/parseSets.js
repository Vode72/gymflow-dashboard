export function parseSetsText(text) {
  if (!text?.trim()) return []

  const pairs = text.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:x|\/)\s*(\d+(?:[.,]\d+)?)/gi)

  return [...pairs].map((match) => ({
    reps: Number(match[1].replace(',', '.')),
    weight: Number(match[2].replace(',', '.')),
  }))
}
