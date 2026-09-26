// Browser adapters: listening (SpeechRecognition), the qari (one shared
// <audio>) and the story voice (speechSynthesis). Each one absorbs a browser's
// quirks — Safari and Chrome on iPhone, Chrome on Android — so the screens
// never need to know where they are running.

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const canListen = !!Recognition

// Errors after which listening again cannot help.
const FATAL = new Set(['not-allowed', 'service-not-allowed', 'language-not-supported', 'network', 'audio-capture'])

/**
 * One recitation, possibly spanning several recognition sessions.
 *
 * Every session is a single utterance (continuous = false): iPhones abort
 * continuous listening, and Chrome on Android repeats words in it. While
 * keepGoing(heard) says so — a whole surah not finished yet — the next session
 * starts by itself, until two in a row bring nothing new. An iPhone may refuse
 * to reopen the mic without a tap: the run then ends as 'paused' with all it
 * heard, and resume() carries on from there.
 *
 * onEnd(heard, reason): reason is null, 'paused', 'timeout' or a FATAL error.
 */
export class Recitation {
  constructor({ keepGoing, onText, onListening, onEnd }) {
    Object.assign(this, { keepGoing, onText, onListening, onEnd })
    this.heard = ''
    this.current = ''
    this.rec = null
  }

  get text() { return `${this.heard} ${this.current}`.trim() }
  get active() { return this.rec !== null }

  start() { this.heard = ''; this.resume() }

  resume() {
    this.quiet = 0
    this.sessions = 0
    this.wanted = true
    this.#session()
  }

  /** Ends after the current session, keeping what was heard. */
  stop() { this.wanted = false; this.rec?.stop() }

  /** Ends now and reports nothing. */
  cancel() { this.wanted = false; this.#detach() }

  #session() {
    const before = this.heard
    let error = null
    const rec = this.rec = new Recognition()
    rec.lang = 'ar-SA'
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1
    this.sessions++
    rec.onstart = () => this.onListening()
    rec.onresult = e => {
      this.current = Array.from(e.results, r => r[0].transcript).join(' ')
      this.onText(this.text)
      this.#kick()
    }
    rec.onerror = e => {
      error = e.error
      if (FATAL.has(e.error)) this.wanted = false
    }
    rec.onend = () => {
      this.heard = this.text
      this.current = ''
      this.quiet = this.heard === before ? this.quiet + 1 : 0
      const refused = this.sessions > 1 && (error === 'not-allowed' || error === 'service-not-allowed')
      if (refused && this.heard) return this.#end('paused')
      if (this.wanted && this.quiet < 2 && this.keepGoing(this.heard)) return this.#session()
      this.#end(FATAL.has(error) ? error : this.timedOut ? 'timeout' : null)
    }
    try { rec.start() } catch { return this.#end(this.sessions > 1 && this.heard ? 'paused' : 'not-allowed') }
    this.#kick()
  }

  // No word for 15 seconds means the engine is stuck; some never call back at all.
  #kick() {
    clearTimeout(this.watchdog)
    this.timedOut = false
    this.watchdog = setTimeout(() => { this.timedOut = true; this.wanted = false; this.rec?.abort() }, 15000)
  }

  #detach() {
    clearTimeout(this.watchdog)
    const rec = this.rec
    this.rec = null
    if (rec) {
      rec.onstart = rec.onresult = rec.onerror = rec.onend = null
      rec.abort()
    }
  }

  #end(reason) {
    this.#detach()
    this.onEnd(this.heard, reason)
  }
}

// ── The qari ────────────────────────────────────────────────────────────────
// One shared <audio>. iPhones only let a page play sound that no tap started
// (the qari after a slip, the verse after a story) on an element a tap has
// already started once — so the first tap anywhere plays a moment of silence.

const player = new Audio()
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
let unlocked = false
document.addEventListener('pointerdown', () => {
  if (unlocked) return
  unlocked = true
  if (!player.src) { player.src = SILENCE; player.play().catch(() => {}) }
}, true)

export const verseUrl = (surah, verse) =>
  `https://everyayah.com/data/Husary_Muallim_128kbps/${String(surah).padStart(3, '0')}${String(verse).padStart(3, '0')}.mp3`
export const wordUrl = path => `https://audio.qurancdn.com/${path}`

export const qari = {
  /** The url playing now, so the screen can show which button or word is sounding. */
  playing: null,
  failed: false,
  onchange: () => {},

  play(url) {
    this.failed = false
    this.playing = url
    player.src = url
    // AbortError only means another play() replaced this one.
    player.play().catch(e => { if (e.name !== 'AbortError') this.fail() })
    this.onchange()
  },

  toggle(url) { this.playing === url ? this.stop() : this.play(url) },

  stop() {
    player.pause()
    this.playing = null
    this.onchange()
  },

  fail() {
    this.playing = null
    this.failed = true
    this.onchange()
  },
}
player.onended = () => { if (qari.playing) { qari.playing = null; qari.onchange() } }
player.onerror = () => { if (qari.playing) qari.fail() }

// ── The story voice ─────────────────────────────────────────────────────────

const synth = window.speechSynthesis
if (synth) synth.onvoiceschanged = () => narrator.onchange()

export const narrator = {
  /** Index of the part being read, or null when quiet. */
  reading: null,
  /** Goes up each time a story is read to the end. */
  finished: 0,
  run: 0,
  onchange: () => {},

  voice(lang) {
    return synth?.getVoices().find(v => v.lang.replace('_', '-').toLowerCase().startsWith(lang))
  },

  /** Whether a voice for [lang] exists. Until the browser lists its voices, assume so and try. */
  canSpeak(lang) {
    if (!synth) return false
    return synth.getVoices().length === 0 || !!this.voice(lang)
  },

  /** Reads [parts] in [locale] from part [from], a sentence at a time: Chrome cuts long utterances short. */
  read(parts, locale, from = 0) {
    if (!synth) return
    synth.cancel()
    const run = ++this.run
    const voice = this.voice(locale.slice(0, 2))
    for (let i = from; i < parts.length; i++) {
      const sentences = parts[i].match(/[^.!?…]+[.!?…]*[”"’)]*\s*/g) ?? [parts[i]]
      sentences.forEach((sentence, k) => {
        const u = new SpeechSynthesisUtterance(sentence.trim())
        u.lang = locale
        if (voice) u.voice = voice
        u.rate = 0.9
        if (k === 0) u.onstart = () => { if (run === this.run) { this.reading = i; this.onchange() } }
        if (i === parts.length - 1 && k === sentences.length - 1) {
          u.onend = () => { if (run === this.run) { this.reading = null; this.finished++; this.onchange() } }
        }
        synth.speak(u)
      })
    }
  },

  stop() {
    this.run++
    synth?.cancel()
    this.reading = null
    this.onchange()
  },
}
