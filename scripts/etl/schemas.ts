export type Region = 'usa'|'eu'|'russia'|'china'
export type CanonSalary = {
  role: string
  region: Region
  value: string          // original form e.g. "$120k/yr"
  sourceId: string
  url?: string
  observedAt?: string    // ISO date
  license?: string
  p10?: string
  p90?: string
}
export type RegionSalary = { value: string; usdpm?: number; p10?: string; p90?: string }
export type MergeRow = {
  role: string
  regions: Partial<Record<Region, RegionSalary>>
  sourceMeta?: Partial<Record<Region, {sourceId: string, url?: string}>>
  fxDate?: string
  p10_usdpm?: number
  p50_usdpm?: number
  p90_usdpm?: number
  levels?: { jMin?: number; jMax?: number; mMin?: number; mMax?: number; sMin?: number; sMax?: number }
}
