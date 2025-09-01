export type Region = 'usa'|'eu'|'russia'|'china'
export type CanonSalary = {
  role: string
  region: Region
  value: string          // original form e.g. "$120k/yr"
  sourceId: string
  url?: string
  observedAt?: string    // ISO date
  license?: string
}
export type MergeRow = {
  role: string
  regions: Partial<Record<Region, string>>
  sourceMeta?: Partial<Record<Region, {sourceId: string, url?: string}>>
}
