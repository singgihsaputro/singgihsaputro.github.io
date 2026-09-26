// Recite Quest on the web: the Android app's three screens — the level grid,
// reciting (one verse or a whole surah) and tonight's story — for Safari and
// Chrome on iPhone and Chrome on Android. Plain modules, no build step.

import { displayWords, match, slice, words } from './matcher.js'
import { canListen, narrator, qari, Recitation, verseUrl, wordUrl } from './media.js'
import { languages } from './strings.js'

const $app = document.getElementById('app')
const CANDY = ['#FF6F91', '#3DBE6C', '#FF9F1C', '#2EA8FF', '#9B7BFF', '#FF7F50']

// Kept in this browser only: best stars per verse, and the chosen language.
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(`recite.${key}`)) ?? fallback } catch { return fallback } },
  set(key, value) { try { localStorage.setItem(`recite.${key}`, JSON.stringify(value)) } catch { /* private mode */ } },
}

let lang = store.get('lang', (navigator.language ?? '').toLowerCase().startsWith('id') ? 'id' : 'en')
let s = languages[lang]
const best = store.get('stars', {})
const starsOf = (surah, verse) => best[`${surah}:${verse}`] ?? 0
const surahStars = surah => surah.verses.reduce((n, v) => n + starsOf(surah.number, v.number), 0)
function record(surah, verse, stars) {
  const key = `${surah}:${verse}`
  if (stars <= (best[key] ?? 0)) return // a worse try never takes stars away
  best[key] = stars
  store.set('stars', best)
}

const meaning = surah => lang === 'id' ? surah.meaning_indonesian : surah.meaning
const translation = verse => lang === 'id' ? verse.indonesian : verse.translation
const telling = story => lang === 'id' ? story.indonesian : story

/** document.createElement with props and children; on* props become listeners. */
function h(tag, props = {}, ...children) {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue
    if (key.startsWith('on')) el.addEventListener(key.slice(2), value)
    else if (key === 'class') el.className = value
    else if (key === 'style') el.style.cssText = value
    else el.setAttribute(key, value === true ? '' : value)
  }
  for (const child of children.flat(Infinity)) if (child != null && child !== false) el.append(child)
  return el
}

// ── Data ────────────────────────────────────────────────────────────────────
// quran.json and story_verses.json are fetched from Quran.com by the Android
// app's tools/fetch_quran.py and copied here as-is; no verse is typed by hand.

let quran, stories, storyVerses
try {
  ;[quran, { stories }, storyVerses] = await Promise.all(
    ['quran.json', 'stories.json', 'story_verses.json'].map(f => fetch(f).then(r => { if (!r.ok) throw new Error(f); return r.json() })))
} catch {
  $app.replaceChildren(h('p', { class: 'fatal' }, 'Could not load the Qur\'an text. Check the internet and reload.'))
  throw new Error('data')
}

/** One story per night, the same all day and the same as the Android app's pick. */
function tonight() {
  const d = new Date()
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5) % stories.length
}

// ── Routing: #/ home, #/surah/78, #/story/12 ────────────────────────────────

let leave = () => {}
let inApp = false

function route() {
  leave()
  leave = () => {}
  const [, page, arg] = location.hash.split('/')
  document.body.classList.toggle('night', page === 'story')
  if (page === 'surah') leave = reciteScreen(quran.find(x => x.number === Number(arg)) ?? quran[0])
  else if (page === 'story') leave = storyScreen(Number(arg) || 0)
  else leave = homeScreen()
  window.scrollTo(0, 0)
}
addEventListener('hashchange', () => { inApp = true; route() })
const goBack = () => (inApp ? history.back() : location.replace('#/'))

function switchLanguage() {
  lang = lang === 'en' ? 'id' : 'en'
  s = languages[lang]
  store.set('lang', lang)
  document.documentElement.lang = lang
  route()
}

function topBar(title, subtitle, trailing = null) {
  return h('header', { class: 'topbar' },
    h('button', { class: 'round', 'aria-label': s.back, onclick: goBack }, '←'),
    h('div', { class: 'grow' }, h('h1', { class: 'title' }, title), h('p', { class: 'sub' }, subtitle)),
    trailing)
}

const starPill = text => h('span', { class: 'pill' }, h('span', { class: 'star', 'aria-hidden': 'true' }, '★'), ` ${text}`)

/** A 🔊 chip for [url]; paintChips() keeps its label in step with the qari. */
function listenChip(label, url) {
  return h('button', { class: 'chip', 'data-url': url, 'data-label': label, onclick: () => qari.toggle(url) }, `🔊 ${label}`)
}
function paintChips(root) {
  for (const chip of root.querySelectorAll('.chip')) {
    const on = qari.playing === chip.dataset.url
    chip.classList.toggle('playing', on)
    chip.textContent = `🔊 ${on ? s.playing : chip.dataset.label}`
  }
}

// ── Home ────────────────────────────────────────────────────────────────────

function homeScreen() {
  const total = quran.reduce((n, x) => n + surahStars(x), 0)
  const t = tonight()
  const story = stories[t]
  $app.replaceChildren(h('main', { class: 'home' },
    h('header', { class: 'hero' },
      h('div', { class: 'hero-row' },
        h('span', { class: 'moon', 'aria-hidden': 'true' }, '🌙'),
        h('h1', {}, 'Recite Quest'),
        h('button', { class: 'pill', 'aria-label': s.switchLanguage, onclick: switchLanguage }, `${s.flag} ${s.code}`),
        starPill(total)),
      h('p', { class: 'tagline' }, s.tagline)),
    h('a', { class: 'tonight', href: `#/story/${t}` },
      h('span', { class: 'emoji', 'aria-hidden': 'true' }, story.emoji),
      h('span', { class: 'grow' },
        h('span', { class: 'kicker' }, s.tonightsBedtimeStory),
        h('span', { class: 'story-name' }, telling(story).title)),
      h('span', { class: 'play', 'aria-hidden': 'true' }, '▶')),
    h('div', { class: 'grid' }, quran.map((surah, i) => {
      const got = surahStars(surah)
      const max = surah.verses.length * 3
      const color = CANDY[i % CANDY.length]
      return h('a', { class: 'tile', href: `#/surah/${surah.number}` },
        h('div', { class: 'tile-top' },
          h('span', { class: 'badge', style: `background:${color}` }, surah.number),
          got === max ? h('span', { class: 'trophy', 'aria-label': 'complete' }, '🏆') : null),
        h('div', { class: 'tile-name' }, surah.name),
        h('div', { class: 'tile-meaning' }, meaning(surah)),
        h('div', { class: 'bar', style: `--c:${color}` }, h('i', { style: `width:${(got / max) * 100}%` })),
        h('div', { class: 'tile-stars' }, `★ ${got} / ${max}`))
    }))))
  return () => {}
}

// ── Recite ──────────────────────────────────────────────────────────────────
// One verse, or the whole surah in one go: the same game over a different
// stretch of text. The targets are matched as one sequence, and each verse
// then keeps the stars of its own share of the result.

function reciteScreen(surah) {
  let whole = false
  let verseNo = 1
  let result = null // the final score
  let live = null // what has been heard so far, while reciting
  let phase = 'idle' // idle | listening | paused | done
  let failure = null
  let heard = ''
  let autoplay = 0
  let following = -1
  let wordEls = []
  let cardEls = []
  let mic, status, resultEl

  const targets = () => whole ? surah.verses : [surah.verses[verseNo - 1]]
  const expected = () => targets().map(v => v.arabic).join(' ')
  // Where each target verse's words start in a result over all of them.
  const starts = () => targets().reduce((out, v) => [...out, out.at(-1) + words(v.arabic).length], [0])
  const share = (r, i) => { const st = starts(); return slice(r, st[i], st[i + 1]) }
  const firstSlip = () => {
    const i = targets().findIndex((_, i) => share(result, i).stars < 3)
    return targets()[Math.max(0, i)]
  }

  const recitation = new Recitation({
    keepGoing: text => whole && match(expected(), text).words.at(-1)?.status !== 'correct',
    onListening: () => { phase = 'listening'; paintMic(); paintStatus() },
    onText: text => {
      live = match(expected(), text)
      paintWords()
      paintStatus()
      follow()
    },
    onEnd: (text, reason) => {
      heard = text
      if (reason === 'paused') { phase = 'paused'; live = match(expected(), text); paint(); return }
      if (!text) { phase = 'idle'; live = null; failure = reason ?? 'nothing'; paint(); return }
      finish()
    },
  })

  function finish() {
    const r = result = match(expected(), heard)
    live = null
    phase = 'done'
    targets().forEach((v, i) => record(surah.number, v.number, share(r, i).stars))
    navigator.vibrate?.(40)
    build()
    resultEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (r.stars === 3) confetti()
    // A slip is answered with how it should sound, once the stars have landed.
    else autoplay = setTimeout(() => qari.play(verseUrl(surah.number, firstSlip().number)), 1700)
  }

  function reset() {
    recitation.cancel()
    qari.stop()
    clearTimeout(autoplay)
    result = live = null
    phase = 'idle'
    failure = null
    heard = ''
    following = -1
  }

  function tapMic() {
    if (!canListen) return
    if (recitation.active) return recitation.stop()
    clearTimeout(autoplay)
    qari.stop() // or the recogniser hears the qari instead of the child
    failure = null
    if (phase === 'paused') {
      recitation.resume()
    } else {
      result = live = null
      heard = ''
      following = -1
      build()
      recitation.start()
    }
    phase = 'listening'
    paintMic()
    paintStatus()
  }

  // Whole surah: keep the verse being recited in view.
  function follow() {
    if (!whole || !live) return
    const word = live.words.findLastIndex(w => w.status === 'correct')
    const i = Math.max(0, starts().findLastIndex(st => st <= word))
    if (i === following) return
    following = i
    cardEls[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function build() {
    wordEls = []
    cardEls = []
    const next = surah.verses[verseNo]
    $app.replaceChildren(h('main', { class: 'recite' },
      topBar(surah.name, meaning(surah), starPill(`${surahStars(surah)} / ${surah.verses.length * 3}`)),
      h('div', { class: 'seg', role: 'group' },
        [[false, `📖 ${s.oneVerse}`], [true, `🕌 ${s.wholeSurah}`]].map(([w, label]) =>
          h('button', { 'aria-pressed': String(w === whole), onclick: () => { if (w !== whole) { reset(); whole = w; build() } } }, label))),
      whole ? null : bubbles(),
      h('div', { class: 'cards' }, targets().map(verseCard)),
      resultEl = result ? resultPanel(next) : null,
      h('div', { class: 'dock' },
        mic = h('button', { class: 'mic', onclick: tapMic, disabled: !canListen }),
        status = h('p', { class: 'status', 'aria-live': 'polite' }))))
    paint()
  }

  function bubbles() {
    const row = h('div', { class: 'bubbles' }, surah.verses.map(v => {
      const got = starsOf(surah.number, v.number)
      const on = v.number === verseNo
      return h('button', {
        class: `bubble${on ? ' on' : ''}${got === 3 ? ' done' : ''}`,
        'aria-pressed': String(on),
        'aria-label': s.verseStars(v.number, got),
        onclick: () => { if (!on) { reset(); verseNo = v.number; build() } },
      }, h('span', { class: 'num' }, v.number), h('span', { class: 'mini' }, '★'.repeat(got) + '☆'.repeat(3 - got)))
    }))
    // Juz 'Amma surahs run to 40+ verses: keep the chosen one in view.
    requestAnimationFrame(() => {
      const on = row.querySelector('.on')
      if (on) row.scrollLeft = on.offsetLeft - row.clientWidth / 2 + on.clientWidth / 2
    })
    return row
  }

  function verseCard(verse) {
    const card = h('section', { class: 'card verse-card' },
      h('div', { class: 'card-head' },
        h('span', { class: 'verse-no' }, s.verse(verse.number)),
        listenChip(s.listen, verseUrl(surah.number, verse.number))),
      h('p', { class: 'arabic', lang: 'ar', dir: 'rtl' }, displayWords(verse.arabic).map((word, k) => {
        const path = verse.audio[k]
        const el = h('button', {
          class: 'w', style: `--k:${k}`, 'data-url': path ? wordUrl(path) : null,
          disabled: !path, onclick: () => qari.play(wordUrl(path)),
        }, word)
        wordEls.push(el)
        return [el, ' ']
      })),
      h('p', { class: 'hint' }, s.tapAnyWord),
      h('p', { class: 'translation' }, translation(verse)))
    cardEls.push(card)
    return card
  }

  function resultPanel(next) {
    const r = result
    const score = h('div', { class: 'score' }, '0')
    countUp(score, Math.round(r.accuracy * 100))
    return h('section', { class: 'card result' },
      h('div', { class: 'stars', role: 'img', 'aria-label': s.starsOutOf3(r.stars) },
        [0, 1, 2].map(i => h('span', { class: `pop${i < r.stars ? ' on' : ''}${i === 1 ? ' big' : ''}`, style: `--d:${200 + i * 220}ms` }, '★'))),
      score,
      h('p', { class: 'words-right' }, s.wordsRight(r.correct, r.total)),
      h('p', { class: 'cheer' }, s.cheer(r.stars)),
      heard ? h('p', { class: 'heard' }, s.iHeard, h('span', { lang: 'ar', dir: 'rtl' }, heard)) : null,
      h('div', { class: 'actions' },
        listenChip(s.hearItRight, verseUrl(surah.number, firstSlip().number)),
        !whole && next ? h('button', { class: 'btn', onclick: () => { reset(); verseNo = next.number; build() } }, s.next) : null),
      h('p', { class: 'fine' }, s.notTajweed))
  }

  function paintWords() {
    const r = result ?? live
    const final = !!result
    wordEls.forEach((el, j) => {
      const state = r?.words[j]?.status
      // Mid-recitation only heard words light up; the rest are waiting, not wrong.
      const shown = state && (final || state === 'correct') ? state : null
      el.classList.toggle('correct', shown === 'correct')
      el.classList.toggle('misread', shown === 'misread')
      el.classList.toggle('missed', shown === 'missed')
      el.classList.toggle('shake', final && (shown === 'misread' || shown === 'missed'))
    })
  }

  function paintMic() {
    const on = recitation.active || phase === 'listening'
    mic.classList.toggle('on', on)
    mic.textContent = on ? '■' : '🎙'
    mic.setAttribute('aria-label', on ? s.stop : s.recite)
  }

  function paintStatus() {
    status.textContent = !canListen ? s.noRecogniser
      : phase === 'listening' ? (live ? s.listening(live.correct, live.total) : s.listeningNow)
        : phase === 'paused' ? s.paused
          : qari.failed ? s.audioFailed
            : failure === 'nothing' ? s.nothingHeard
              : failure ? (s.failure[failure] ?? failure)
                : phase === 'done' ? s.tapToTryAgain
                  : whole ? s.tapToReciteSurah : s.tapToRecite(verseNo)
  }

  function paintAudio() {
    paintChips($app)
    for (const el of wordEls) el.classList.toggle('sounding', !!el.dataset.url && el.dataset.url === qari.playing)
    paintStatus()
  }

  function paint() { paintWords(); paintMic(); paintStatus(); paintAudio() }

  qari.onchange = paintAudio
  build()
  return () => { reset(); qari.onchange = () => {} }
}

function countUp(el, to) {
  const t0 = performance.now()
  const step = now => {
    const p = Math.min(1, (now - t0) / 900)
    el.textContent = Math.round(to * (1 - (1 - p) ** 3))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/** A burst of falling confetti. Draws only; never takes a touch. */
function confetti() {
  const canvas = h('canvas', { class: 'confetti', 'aria-hidden': 'true' })
  document.body.append(canvas)
  const ctx = canvas.getContext('2d')
  const dpr = devicePixelRatio || 1
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  ctx.scale(dpr, dpr)
  const colors = [...CANDY, '#FFC53D']
  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random(), start: Math.random() * 0.3, speed: 0.8 + Math.random() * 0.6,
    spin: Math.random() * 12 - 6, color: colors[Math.floor(Math.random() * colors.length)],
  }))
  const t0 = performance.now()
  const frame = now => {
    const t = (now - t0) / 2600
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    if (t >= 1) return canvas.remove()
    ctx.globalAlpha = Math.min(1, (1 - t) / 0.2)
    for (const p of pieces) {
      const f = Math.max(0, (t - p.start) / (1 - p.start))
      if (!f) continue
      const x = p.x * innerWidth + Math.sin(f * 10 + p.x * 6) * 24
      const y = -20 + f * p.speed * (innerHeight + 40)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(p.spin * f)
      ctx.fillStyle = p.color
      ctx.fillRect(-6, -3, 12, 6)
      ctx.restore()
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

// ── Tonight's story ─────────────────────────────────────────────────────────
// Read aloud by the device's own voice with each part lit as it is read,
// ending on the real verse the story comes from, recited by the qari.

function storyScreen(index) {
  index = ((index % stories.length) + stories.length) % stories.length
  const story = stories[index]
  const told = telling(story)
  const verse = storyVerses[story.verse]
  const [surahNo, verseNo] = story.verse.split(':').map(Number)
  const url = verseUrl(surahNo, verseNo)
  // What the voice reads: the title, the story, then its lesson.
  const parts = [told.title, ...told.paragraphs, s.lessonPrefix + told.lesson]
  let resumeFrom = 0
  let finished = narrator.finished
  let lit = null

  const go = to => location.replace(`#/story/${((to % stories.length) + stories.length) % stories.length}`)

  const partEls = [
    h('h2', { class: 'story-title' }, told.title),
    ...told.paragraphs.map(p => h('p', { class: 'para' }, p)),
    h('div', { class: 'lesson' }, h('span', { 'aria-hidden': 'true' }, '💡 '), told.lesson),
  ]
  const play = h('button', { class: 'play-big', onclick: toggle })
  const status = h('p', { class: 'status', 'aria-live': 'polite' })
  const verseCard = h('section', { class: 'card story-verse' },
    h('div', { class: 'card-head' }, h('span', { class: 'verse-no' }, s.fromQuran(story.verse)), listenChip(s.listen, url)),
    h('p', { class: 'arabic plain', lang: 'ar', dir: 'rtl' }, verse.arabic),
    h('p', { class: 'translation' }, lang === 'id' ? verse.indonesian : verse.translation))

  function toggle() {
    if (narrator.reading != null) {
      resumeFrom = narrator.reading
      narrator.stop()
    } else {
      qari.stop()
      narrator.read(parts, s.voice, resumeFrom)
    }
    paint()
  }

  function paint() {
    const reading = narrator.reading
    partEls.forEach((el, i) => {
      el.classList.toggle('lit', reading === i)
      el.classList.toggle('dim', reading != null && reading !== i)
    })
    if (reading !== lit && reading != null) partEls[reading].scrollIntoView({ behavior: 'smooth', block: 'center' })
    lit = reading
    // The story ends on its verse, recited by the qari.
    if (narrator.finished !== finished) {
      finished = narrator.finished
      resumeFrom = 0
      verseCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => qari.play(url), 700)
    }
    const voice = narrator.canSpeak(s.lang)
    play.disabled = !voice
    play.textContent = reading != null ? '❚❚' : '▶'
    play.setAttribute('aria-label', reading != null ? s.pause : s.tellStory)
    status.textContent = !voice ? s.noStoryVoice : reading != null ? s.telling : qari.failed ? s.verseFailed : s.tapToHearStory
    paintChips($app)
  }

  const sky = h('div', { class: 'sky', 'aria-hidden': 'true' }, Array.from({ length: 50 }, () =>
    h('i', { style: `left:${Math.random() * 100}%;top:${Math.random() * 70}%;animation-delay:${Math.random() * 4}s;--r:${1 + Math.random() * 1.6}px` })))

  $app.replaceChildren(sky, h('main', { class: 'story' },
    topBar(index === tonight() ? s.tonightsStory : s.bedtimeStories, s.storyCount(index + 1, stories.length)),
    h('div', { class: 'story-head' },
      h('div', { class: 'story-emoji', 'aria-hidden': 'true' }, story.emoji),
      partEls[0],
      h('p', { class: 'refs' }, s.retoldFrom(story.refs))),
    partEls.slice(1),
    verseCard,
    h('p', { class: 'goodnight' }, s.goodnight),
    h('p', { class: 'grown-ups' }, s.forGrownUps(story.refs)),
    h('div', { class: 'dock' },
      h('div', { class: 'controls' },
        h('button', { class: 'round', 'aria-label': s.previousStory, onclick: () => go(index - 1) }, '‹'),
        play,
        h('button', { class: 'round', 'aria-label': s.nextStory, onclick: () => go(index + 1) }, '›')),
      status)))

  narrator.onchange = paint
  qari.onchange = paint
  paint()
  return () => {
    narrator.stop()
    qari.stop()
    narrator.onchange = qari.onchange = () => {}
  }
}

document.documentElement.lang = lang
route()
