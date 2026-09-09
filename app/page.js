import RotatingRole from '@/components/RotatingRole'
import { profile, stats, skills, experience, education, projects } from '@/data/cv'

const NAV = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Contact', '#contact'],
]

function SectionHead({ label, title, sub }) {
  return (
    <div className="reveal mb-12">
      <p className="mb-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">{label}</p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-muted">{sub}</p>}
    </div>
  )
}

export default function Page() {
  const hasEducation = education.length > 0

  return (
    <>
      {/* ── nav ───────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-mono text-sm font-medium tracking-tight">
            singgih<span className="text-accent">.</span>
          </a>
          <ul className="hidden gap-7 text-sm text-muted sm:flex">
            {NAV.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-fg">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-5xl px-6">
        {/* ── hero ────────────────────────────────────────── */}
        <section className="relative flex min-h-svh flex-col justify-center pt-24 pb-20">
          {/* drifting colour behind the text */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="blob absolute -top-24 -left-32 h-[26rem] w-[26rem] rounded-full bg-accent/12 blur-[110px]" />
            <div
              className="blob absolute top-32 -right-24 h-[24rem] w-[24rem] rounded-full bg-accent-2/12 blur-[110px]"
              style={{ animationDelay: '-8s' }}
            />
          </div>

          <img
            src={profile.avatar}
            alt=""
            width={72}
            height={72}
            className="rise mb-8 size-18 rounded-full border border-line"
            style={{ '--i': 0 }}
          />

          <p className="rise mb-4 font-mono text-sm text-muted" style={{ '--i': 1 }}>
            {profile.location} · {profile.company}
          </p>

          <h1
            className="rise text-5xl font-semibold tracking-tighter sm:text-7xl"
            style={{ '--i': 2 }}
          >
            <span className="gradient-text">{profile.name}</span>
          </h1>

          <p
            className="rise mt-5 text-xl sm:text-2xl"
            style={{ '--i': 3 }}
            aria-label={profile.roles.join(', ')}
          >
            <RotatingRole roles={profile.roles} />
          </p>

          <p className="rise mt-7 max-w-xl text-muted" style={{ '--i': 4 }}>
            {profile.summary}
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={{ '--i': 5 }}>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              Get in touch
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg"
            >
              View GitHub
            </a>
            {profile.resume && (
              <a
                href={profile.resume}
                className="rounded-full border border-line px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg"
              >
                Download CV
              </a>
            )}
          </div>

          <dl className="rise mt-16 grid max-w-lg grid-cols-3 gap-6" style={{ '--i': 6 }}>
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-2xl text-fg">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── skills ──────────────────────────────────────── */}
        <section id="about" className="border-t border-line py-24">
          <SectionHead
            label="What I work with"
            title="Skills"
            sub="Day-to-day tools, roughly in the order I reach for them."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {skills.map((s, i) => (
              <div
                key={s.group}
                className="reveal card rounded-2xl border border-line bg-ink-2 p-6"
                style={{ '--d': `${i * 70}ms` }}
              >
                <h3 className="mb-4 font-mono text-xs tracking-[0.15em] text-accent uppercase">
                  {s.group}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── experience ──────────────────────────────────── */}
        <section id="experience" className="border-t border-line py-24">
          <SectionHead label="Where I have been" title="Experience" />
          <ol className="relative border-l border-line pl-8">
            {experience.map((job, i) => (
              <li
                key={`${job.company}-${i}`}
                className="reveal mb-12 last:mb-0"
                style={{ '--d': `${i * 90}ms` }}
              >
                <span className="absolute -left-[5px] mt-2 size-2.5 rounded-full bg-accent ring-4 ring-ink" />
                <p className="font-mono text-xs text-muted">{job.period}</p>
                <h3 className="mt-2 text-xl font-medium">
                  {job.role} <span className="text-accent">@ {job.company}</span>
                </h3>
                <p className="mt-1 text-sm text-muted">{job.location}</p>
                <ul className="mt-4 space-y-2">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-3 text-muted">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent/60" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* ── projects ────────────────────────────────────── */}
        <section id="projects" className="border-t border-line py-24">
          <SectionHead
            label="Selected work"
            title="Projects"
            sub="Public repositories — samples, experiments, and things I actually use."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((p, i) => (
              <a
                key={p.repo}
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="reveal card flex flex-col rounded-2xl border border-line bg-ink-2 p-6"
                style={{ '--d': `${i * 60}ms` }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium">{p.name}</h3>
                  <span className="font-mono text-xs text-muted">{p.year}</span>
                </div>
                <p className="mt-3 grow text-sm text-muted">{p.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </section>

        {/* ── education ───────────────────────────────────── */}
        {hasEducation && (
          <section className="border-t border-line py-24">
            <SectionHead label="Background" title="Education" />
            <div className="grid gap-5 sm:grid-cols-2">
              {education.map((e, i) => (
                <div
                  key={`${e.school}-${i}`}
                  className="reveal card rounded-2xl border border-line bg-ink-2 p-6"
                  style={{ '--d': `${i * 70}ms` }}
                >
                  <p className="font-mono text-xs text-muted">{e.period}</p>
                  <h3 className="mt-2 font-medium">{e.school}</h3>
                  <p className="mt-1 text-sm text-muted">{e.degree}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── contact ─────────────────────────────────────── */}
        <section id="contact" className="border-t border-line py-28 text-center">
          <div className="reveal">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">Contact</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Let us build something.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Open to interesting mobile work and good conversations about Kotlin.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                {profile.email}
              </a>
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line px-6 py-3 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <p className="mx-auto max-w-5xl px-6 font-mono text-xs text-muted">
          © {new Date().getFullYear()} {profile.name} — built with Next.js and Tailwind.
        </p>
      </footer>
    </>
  )
}
