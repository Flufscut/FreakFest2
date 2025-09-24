import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ZoomIn } from 'lucide-react'

interface Manifest { images: string[] }

export default function GallerySection() {
  const [images, setImages] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(12)
  const sentinelRef = useState<HTMLDivElement | null>(null)[0]
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/gallery-manifest', { cache: 'no-cache' })
        if (res.ok) {
          const data: Manifest = await res.json()
          setImages(data.images)
        }
      } catch (e) {
        // ignore; keep empty gallery
      }
    })()
  }, [])

  useEffect(() => {
    const node = document.getElementById('gallery-sentinel')
    if (!node) return
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setVisibleCount((c) => c + 12)
      }
    }, { rootMargin: '200px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const open = selectedIndex !== null
  const close = () => setSelectedIndex(null)
  const next = () => setSelectedIndex((i) => i === null ? null : (i + 1) % images.length)
  const prev = () => setSelectedIndex((i) => i === null ? null : (i - 1 + images.length) % images.length)

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary explosive-entry text-explosion glitch-effect">GALLERY</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Authentic moments from last year’s Freakfest
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(images.length ? images.slice(0, visibleCount) : Array.from({ length: 12 })).map((fileOrUndefined, index) => {
            const file = typeof fileOrUndefined === 'string' ? fileOrUndefined : undefined
            const isSkeleton = !file
            return (
            <Card 
              key={file ?? `skeleton-${index}`}
              className={`hover-elevate cursor-pointer transition-all duration-300 overflow-hidden`}
              onClick={() => !isSkeleton && setSelectedIndex(index)}
              data-testid={`gallery-image-${index}`}
            >
              <CardContent className="p-0 relative group">
                <div className="aspect-square overflow-hidden">
                  {isSkeleton ? (
                    <div className="w-full h-full bg-white/5 animate-pulse" />
                  ) : (
                    <img 
                      src={`/api/gallery-thumb?f=${encodeURIComponent(file)}&w=480&fmt=auto&q=60&square=1`}
                      srcSet={`${`/api/gallery-thumb?f=${encodeURIComponent(file)}&w=320&fmt=auto&q=55&square=1`} 320w, ${`/api/gallery-thumb?f=${encodeURIComponent(file)}&w=480&fmt=auto&q=60&square=1`} 480w, ${`/api/gallery-thumb?f=${encodeURIComponent(file)}&w=768&fmt=auto&q=60&square=1`} 768w`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      alt={`Freakfest photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '400px 400px' as any }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = `/assets/gallery/freakfest/${file}`; }}
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
        <div id="gallery-sentinel" className="h-1 w-full" />

        <Dialog open={open} onOpenChange={close}>
          <DialogContent className="max-w-5xl w-full h-full max-h-[90vh] p-0 bg-black/95" data-testid="gallery-lightbox">
            {open && selectedIndex !== null && (
              <div className="relative w-full h-full flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                  onClick={close}
                  data-testid="button-close-lightbox"
                >
                  <X className="h-6 w-6" />
                </Button>
                <div className="max-w-full max-h-full p-4">
                  <img 
                    src={`/assets/gallery/freakfest/${images[selectedIndex]}`}
                    alt={`Freakfest photo ${selectedIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain rounded"
                  />
                </div>
                <Button
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prev}
                  data-testid="button-prev-image"
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={next}
                  data-testid="button-next-image"
                >
                  →
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}