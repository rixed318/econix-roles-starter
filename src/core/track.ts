export type Track = 'Frontend'|'Backend'|'Data'|'ML'|'DevOps/SRE'|'Security'|'Mobile'|'Other'
export function inferTrack(title: string): Track {
  const t = title.toLowerCase()
  if (/front.?end|ui|web/i.test(title)) return 'Frontend'
  if (/back.?end|server|api/i.test(title)) return 'Backend'
  if (/data (analyst|engineer)|bi\b/i.test(title)) return 'Data'
  if (/\bml|machine learning|ai/i.test(title)) return 'ML'
  if (/devops|sre|platform/i.test(title)) return 'DevOps/SRE'
  if (/sec|security|appsec|soc|pentest/i.test(title)) return 'Security'
  if (/mobile|android|ios|flutter|react native/i.test(title)) return 'Mobile'
  return 'Other'
}
