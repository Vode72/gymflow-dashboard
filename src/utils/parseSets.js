export function parseSetsText(text) {
  if (!text?.trim()) return []

  const pairs = text.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:x|\/)\s*(\d+(?:[.,]\d+)?)/gi)

  return [...pairs].map((match) => ({
    reps: Number(match[1].replace(',', '.')),
    weight: Number(match[2].replace(',', '.')),
  }))
}

export function isValidSetsText(text) {
  if (!text?.trim()) return true

  const withoutPairs = text.replace(/(\d+(?:[.,]\d+)?)\s*(?:x|\/)\s*(\d+(?:[.,]\d+)?)/gi, '')
  return parseSetsText(text).length > 0 && /^[\s+/]*$/.test(withoutPairs)
}
