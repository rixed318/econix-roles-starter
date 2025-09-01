export type Answer = {
  math: 'low'|'mid'|'high'
  creativity: 'low'|'mid'|'high'
  teamwork: 'solo'|'mixed'|'team'
  runtime: 'web'|'mobile'|'data'|'systems'|'any'
  risk: 'stable'|'startup'
  salaryFocus: 'ok'|'max'
}

export function recommend(a: Answer): { roles: string[]; rationale: string } {
  const picks = new Set<string>()
  if (a.runtime === 'web') { picks.add('Frontend Engineer'); if (a.math === 'high') picks.add('ML Engineer') }
  if (a.runtime === 'mobile') { picks.add('Mobile Developer (Flutter)') }
  if (a.runtime === 'data') { picks.add('Data Analyst'); picks.add('Data Engineer'); if (a.math!=='low') picks.add('ML Engineer') }
  if (a.runtime === 'systems') { picks.add('Backend Engineer'); picks.add('DevOps/SRE'); if (a.math==='high') picks.add('Security Engineer') }
  if (a.salaryFocus === 'max') { picks.add('ML Engineer'); picks.add('Security Engineer'); picks.add('Senior Backend Engineer') }
  if (a.teamwork === 'solo') { picks.add('Indie/Full-Stack') }
  return { roles: Array.from(picks), rationale: 'Подбор по предпочтениям и потенциальным зарплатным трекам.' }
}
