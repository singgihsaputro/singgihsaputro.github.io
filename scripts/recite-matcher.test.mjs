// Checks public/recite/matcher.js against the same cases as the Kotlin
// RecitationTest in quran-reciter. Run: node --test scripts/
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { displayWords, match, normalize, slice, words } from '../public/recite/matcher.js'

const ikhlas1 = 'قُلْ هُوَ ٱللَّهُ أَحَدٌ'

test('strips harakat so undiacritised speech matches Uthmani text', () => {
  assert.equal(normalize('قل هو الله احد'), normalize(ikhlas1))
})

test('folds alif variants, ta marbuta and alif maqsura', () => {
  assert.equal(new Set(['أحد', 'إحد', 'آحد', 'ٱحد', 'احد'].map(w => normalize(w))).size, 1)
  assert.equal(normalize('صلاه'), normalize('صلاة'))
  assert.equal(normalize('هدي'), normalize('هدى'))
})

test('drops tatweel and punctuation, collapses whitespace', () => {
  assert.equal(normalize('قـــل.'), 'قل')
  assert.deepEqual(words('  قل   هو \n الله  '), ['قل', 'هو', 'الله'])
  assert.deepEqual(words('   '), [])
})

test('standalone pause marks ride on a neighbouring word', () => {
  assert.deepEqual(displayWords('قل ۖ هو الله'), ['قل ۖ', 'هو', 'الله'])
  assert.deepEqual(displayWords('۞ قل هو'), ['۞ قل', 'هو'])
})

test('a correct recitation scores every word', () => {
  const r = match(ikhlas1, 'قل هو الله احد')
  assert.equal(r.correct, 4)
  assert.equal(r.stars, 3)
})

test('a skipped word is missed and does not wreck the rest', () => {
  const r = match(ikhlas1, 'قل الله احد')
  assert.equal(r.correct, 3)
  assert.equal(r.stars, 2)
  assert.equal(r.words[1].status, 'missed')
})

test('a wrong word is misread and what was heard is kept', () => {
  const r = match(ikhlas1, 'قل هو الله واحد')
  assert.equal(r.words[3].status, 'misread')
  assert.equal(r.words[3].heard, 'واحد')
})

test('an inserted word does not shift everything after it', () => {
  const r = match(ikhlas1, 'قل يا هو الله احد')
  assert.equal(r.correct, 4)
  assert.deepEqual(r.extraHeard, ['يا'])
})

test('silence, reversal and an empty verse', () => {
  assert.equal(match(ikhlas1, '').stars, 0)
  assert.ok(match(ikhlas1, 'احد الله هو قل').correct < 4)
  assert.equal(match('', 'قل').total, 0)
})

test('Uthmani long vowels match how a recogniser spells them', () => {
  for (const [uthmani, spoken] of [
    ['ٱلرَّحْمَـٰنِ', 'الرحمن'],
    ['ٱلْعَـٰلَمِينَ', 'العالمين'],
    ['ٱلْحَيَوٰةَ', 'الحياة'],
    ['ٱلسَّمَـٰوَٰتِ', 'السماوات'],
    ['أَتَىٰكَ', 'أتاك'],
    ['إِلَىٰ', 'إلى'],
    ['ءَامَنُوا۟', 'آمنوا'],
    ['وَٱلَّيْلِ', 'والليل'],
  ]) assert.equal(match(uthmani, spoken).correct, 1, `${uthmani} vs ${spoken}`)
  assert.equal(match('ٱلسَّمَـٰوَٰتِ', 'السمات').correct, 0)
})

test('a whole-surah result splits back into verses', () => {
  const r = match(['قُلْ هُوَ ٱللَّهُ أَحَدٌ', 'ٱللَّهُ ٱلصَّمَدُ'].join(' '), 'قل هو الله احد الصمد')
  assert.equal(slice(r, 0, 4).stars, 3)
  assert.equal(slice(r, 4, 6).correct, 1)
  assert.equal(slice(r, 4, 6).words[0].status, 'missed')
})
