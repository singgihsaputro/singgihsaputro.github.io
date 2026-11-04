// How "Every public repository" is grouped. Rules, not a hand-kept list, so a
// new repository files itself the next time the site rebuilds.
//
// Keep in step with GROUPS in scripts/highlight-repos.py of the
// singgihsaputro/singgihsaputro profile repository, which renders the same list.

export const GROUPS = [
  { id: 'projects', label: 'Projects' },
  { id: 'android', label: 'Android apps', nightly: true, prefixes: ['android-'] },
  { id: 'androidlib', label: 'Android libraries', nightly: true, prefixes: ['androidlib-'] },
  { id: 'ios', label: 'iOS apps', nightly: true, prefixes: ['ios-'] },
  { id: 'kmp', label: 'Kotlin Multiplatform', nightly: true, prefixes: ['kmp-', 'kmpfullstack-'] },
  { id: 'web', label: 'Web apps', nightly: true, prefixes: ['web-'] },
  { id: 'backend', label: 'Backends', nightly: true, prefixes: ['backend-'] },
  { id: 'freelance', label: 'Freelance web apps', nightly: true, prefixes: ['freelance-'] },
  // GitHub counts generated platform code (C++, Makefiles); these are all Flutter.
  { id: 'flutter', label: 'Flutter samples', prefixes: ['flutter_'], language: 'Dart' },
  { id: 'early', label: 'Early work, 2016–2019' },
]

/** The group a repository belongs to, from its name and creation date (YYYY-MM-DD…). */
export function groupOf(name, created) {
  const byPrefix = GROUPS.find((g) => g.prefixes?.some((p) => name.startsWith(p)))
  if (byPrefix) return byPrefix.id
  return created < '2020' ? 'early' : 'projects'
}

/** The language to show: the group's own, where it has one, over GitHub's guess. */
export function languageOf(group, githubLanguage) {
  return GROUPS.find((g) => g.id === group)?.language || githubLanguage || ''
}

/** Repositories never listed: the profile README repository itself. */
export const HIDDEN = ['singgihsaputro']
