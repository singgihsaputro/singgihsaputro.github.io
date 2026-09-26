// Scores a recitation word by word. A line-for-line port of ArabicNormalizer.kt
// and RecitationMatcher.kt in github.com/singgihsaputro/quran-reciter — change
// one, change the other. scripts/recite-matcher.test.mjs checks this copy.
//
// It compares words, not tajweed: normalising deletes the harakat and marks
// where tajweed lives. A full score means the right words in the right order.

const MARKS = /[ً-ٰٟۖ-ࣰۭ-ࣿ]/g
const NON_ARABIC = /[^ء-يٱ\s]/g
const SPACES = /\s+/g
const FOLDS = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ى': 'ي', 'ئ': 'ي', 'ؤ': 'و', 'ة': 'ه' }
const DAGGER_ALIF = 'ٰ'
// A waw right against a superscript alif is silent (ٱلْحَيَوٰةَ → الحياة);
// mid-word ىٰ is an alif (أَتَىٰكَ → أتاك) but stays ى at the end (إِلَىٰ → إلى).
const SILENT_WAW = /وٰ/g
const YA_ALIF_IN_WORD = /ىٰ(?=[ً-ٕ]*[ء-ي])/g
// Hamza is an alif, and a run of alifs is one (ءَامَنُوا → آمنوا, أَرَءَيْتَ → أرأيت).
const ALIF_RUN = /ا{2,}/g
// Uthmani writes al-layl with one lam.
const LAYL = /(^|\s)(و?)الليل/g

/** [daggerAlif] is what a superscript alif becomes: modern spelling writes some out and drops others. */
export function normalize(input, daggerAlif = 'ا') {
  const unstretched = input.replaceAll('ـ', '').replace(SILENT_WAW, 'ا').replace(YA_ALIF_IN_WORD, 'ا')
  let folded = ''
  for (const c of unstretched) folded += c === DAGGER_ALIF ? daggerAlif : (FOLDS[c] ?? c)
  return folded
    .replace(MARKS, '')
    .replace(NON_ARABIC, ' ')
    .replace(SPACES, ' ')
    .trim()
    .replaceAll('ء', 'ا')
    .replace(ALIF_RUN, 'ا')
    .replace(LAYL, '$1$2اليل')
}

export const words = (input, daggerAlif = 'ا') => normalize(input, daggerAlif).split(' ').filter(Boolean)

/** The verse as drawn, aligned index-for-index with words(): standalone pause marks ride on a neighbour. */
export function displayWords(input) {
  const out = []
  let lead = ''
  for (const token of input.split(SPACES).filter(Boolean)) {
    if (words(token).length) { out.push(lead + token); lead = '' }
    else if (!out.length) lead += token + ' '
    else out[out.length - 1] += ' ' + token
  }
  return out
}

function result(scored, extraHeard) {
  const correct = scored.filter(w => w.status === 'correct').length
  const total = scored.length
  const accuracy = total ? correct / total : 0
  const stars = !total ? 0 : correct === total ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.4 ? 1 : 0
  return { words: scored, extraHeard, correct, total, accuracy, stars }
}

/** The part covering expected words [from, to): one verse of a whole-surah recitation. */
export const slice = (r, from, to) => result(r.words.slice(from, to), [])

/**
 * Aligns what was heard against the verse by longest common subsequence, so one
 * dropped word doesn't shift the rest. A word outside the alignment is 'misread'
 * if something was heard in its place, 'missed' if nothing was.
 */
export function match(expectedVerse, heardText) {
  const expected = words(expectedVerse)
  // Superscript alifs dropped instead of written out: الرحمن, but العالمين.
  const bare = words(expectedVerse, '')
  const heard = words(heardText)
  if (!expected.length) return result([], heard)

  const same = (i, j) => heard[j] === expected[i] || heard[j] === bare[i]
  const pairs = lcs(expected.length, heard.length, same)
  const matchedHeard = new Set(pairs.values())
  const leftovers = heard.filter((_, j) => !matchedHeard.has(j))

  const scored = expected.map((word, i) =>
    pairs.has(i) ? { expected: word, heard: heard[pairs.get(i)], status: 'correct' }
      : leftovers.length ? { expected: word, heard: leftovers.shift(), status: 'misread' }
        : { expected: word, heard: null, status: 'missed' })
  return result(scored, leftovers)
}

/** Map of expectedIndex -> heardIndex for one longest common subsequence. */
function lcs(a, b, same) {
  const lengths = Array.from({ length: a + 1 }, () => new Int32Array(b + 1))
  for (let i = a - 1; i >= 0; i--)
    for (let j = b - 1; j >= 0; j--)
      lengths[i][j] = same(i, j) ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1])
  const pairs = new Map()
  let i = 0, j = 0
  while (i < a && j < b) {
    if (same(i, j)) { pairs.set(i, j); i++; j++ }
    else if (lengths[i + 1][j] >= lengths[i][j + 1]) i++
    else j++
  }
  return pairs
}
