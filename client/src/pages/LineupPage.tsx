import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect, useMemo, useState } from 'react'

type Manifest = { files?: string[]; grouped?: Record<string, { file: string }[]> }
type DateMap = Record<string, string>

type DayKey = 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | 'Special Events' | 'All Days'

function inferDay(file: string): DayKey {
  const f = file.toLowerCase()
  if (/day1|thu|thurs/.test(f)) return 'Thursday'
  if (/fri/.test(f)) return 'Friday'
  if (/sat/.test(f)) return 'Saturday'
  if (/sun|sunday/.test(f) || /sundayservice/.test(f)) return 'Sunday'
  if (/halloween/.test(f)) return 'Special Events'
  return 'All Days'
}

const dayOrder: Record<DayKey, number> = {
  'Thursday': 0,
  'Friday': 1,
  'Saturday': 2,
  'Sunday': 3,
  'All Days': 98,
  'Special Events': 99,
}

export default function LineupPage() {
  const [files, setFiles] = useState<string[]>([])
  const [dateMap, setDateMap] = useState<DateMap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/assets/flyers/manifest.json', { cache: 'no-cache' })
        if (!res.ok) throw new Error(`Failed to load flyers: ${res.status}`)
        const json: Manifest = await res.json()
        const rawList = json.files && Array.isArray(json.files) && json.files.length
          ? json.files
          : Object.values(json.grouped || {}).flat().map(x => x.file)
        const isImg = (f: string) => /\.(png|jpe?g|webp)$/i.test(f)
        const list = rawList.filter(isImg).filter(f => !f.startsWith("._"))
        setFiles(list)

        try {
          const datesRes = await fetch('/assets/flyers/dates.json', { cache: 'no-cache' })
          if (datesRes.ok) {
            const dates: DateMap = await datesRes.json()
            setDateMap(dates)
          }
        } catch {}
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load flyers')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function extractDateFromFilename(file: string): string | null {
    const name = decodeURIComponent(file).replace(/\.[a-z0-9]+$/i, '')
    const m1 = name.match(/(?:^|\b)(\d{1,2})[:._\-/ ](\d{1,2})(?:\b|[^\d])/)
    if (m1) {
      const mm = Number(m1[1])
      const dd = Number(m1[2])
      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const y = 2025
        const iso = `${y}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}`
        return iso
      }
    }
    const m2 = name.match(/\b(oct(?:ober)?)\s*[-_. ]?\s*(\d{1,2})\b/i)
    if (m2) {
      const dd = Number(m2[2])
      if (dd >= 1 && dd <= 31) {
        const iso = `2025-10-${String(dd).padStart(2,'0')}`
        return iso
      }
    }
    return null
  }

  const sortedFlyers = useMemo(() => {
    const numbered = files.filter((f) => /^\d+\s*-\s*/.test(decodeURIComponent(f)))
    const chosen = numbered.length ? numbered : files
    const withDates = chosen.map((f) => {
      const iso = (dateMap && dateMap[f]) || extractDateFromFilename(f)
      return { file: f, iso }
    })
    withDates.sort((a, b) => a.file.localeCompare(b.file, undefined, { sensitivity: 'base' }))
    return withDates
  }, [files, dateMap])

  const imageUrl = (file: string) => `/assets/flyers/${encodeURIComponent(file)}`

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl md:text-6xl font-black mb-4 text-primary">LINEUP</h1>
            </div>

            {loading && <div className="text-center text-muted-foreground">Loading…</div>}
            {error && <div className="text-center text-red-500">{error}</div>}

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedFlyers.map((item, idx) => (
                  <img
                    key={item.file + idx}
                    src={imageUrl(item.file)}
                    alt={`Flyer ${idx + 1}`}
                    className="w-full h-auto rounded-lg shadow"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
