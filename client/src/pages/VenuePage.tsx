import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function VenuePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <section className="container mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-6xl font-black mb-4 text-primary">VENUE</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Freak Fest’s home base and how to get here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="overflow-hidden rounded-lg border border-primary/20 bg-black/60 backdrop-blur-sm">
                <video
                  className="w-full h-auto"
                  src="/assets/venue/dji_fly_20241020_124314_0_1729443149016_video_cache.mp4"
                  controls
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="metadata"
                />
              </div>

              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h2 className="text-2xl font-bold mb-3">Location</h2>
                <p className="text-muted-foreground">
                  Cartersville Country Winery, 571 Lamar Hwy, Timmonsville, SC 29161. The winery is tucked away in the country yet easily reached via I-20, I-95, or Hwy 76.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://maps.apple.com/?address=571%20Lamar%20Hwy,%20Timmonsville,%20SC%2029161,%20United%20States&ll=34.075900,-79.988300&q=Cartersville%20Country%20Winery"
                    target="_blank" rel="noreferrer noopener"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-black font-semibold border-2 border-primary"
                  >
                    Open in Maps
                  </a>
                  <a
                    href="https://cartersvillecountrywinery.com/"
                    target="_blank" rel="noreferrer noopener"
                    className="inline-flex items-center px-4 py-2 rounded-md border border-border hover:border-primary/60 transition-colors"
                  >
                    Venue Website
                  </a>
                </div>

                {/* Interactive map */}
                <div className="mt-6 overflow-hidden rounded-lg border border-primary/20 bg-black/40">
                  <iframe
                    title="Cartersville Country Winery Map"
                    src="https://www.google.com/maps?q=Cartersville%20Country%20Winery%20571%20Lamar%20Hwy%20Timmonsville%20SC%2029161&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="w-full h-[320px] md:h-[420px] border-0"
                  />
                </div>
              </div>

              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h2 className="text-2xl font-bold mb-3">Travel & Parking</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Arrive via I-20, I-95, or Hwy 76. Follow signage from the highway to the winery entrance.</li>
                  <li>On-site parking available; follow staff directions on arrival.</li>
                  <li>Rideshare drop-off is supported at the main entrance loop.</li>
                </ul>
              </div>

              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h2 className="text-2xl font-bold mb-3">Festival Grounds</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Multiple stages across the property with day bands and late-night dance programming.</li>
                  <li>Food vendors, rest areas, and water stations located near central walkways.</li>
                  <li>Pet-friendly venue; be mindful of crowds and keep pets leashed.</li>
                </ul>
              </div>

              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h2 className="text-2xl font-bold mb-3">Camping</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Camping included with multi-day passes; follow posted guidelines at check-in.</li>
                  <li>Bring warm layers for late nights and early mornings.</li>
                  <li>Respect quiet hours in designated camping areas.</li>
                </ul>
              </div>

              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h2 className="text-2xl font-bold mb-3">Tasting Room & Winery</h2>
                <p className="text-muted-foreground">
                  The winery hosts daily tastings and offers a variety of handcrafted muscadine and fruit wines. Check the venue site for hours and offerings.
                </p>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h3 className="text-xl font-semibold mb-3">Get Involved</h3>
                <p className="text-muted-foreground mb-4">Apply, volunteer, donate, or grab tickets for special events.</p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg"
                    target="_blank" rel="noreferrer noopener"
                    className="text-primary hover:underline"
                  >
                    Vendor Application
                  </a>
                  <a
                    href="https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg"
                    target="_blank" rel="noreferrer noopener"
                    className="text-primary hover:underline"
                  >
                    Volunteer Application
                  </a>
                  <a
                    href="https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg"
                    target="_blank" rel="noreferrer noopener"
                    className="text-primary hover:underline"
                  >
                    Donate to the Hewett Family
                  </a>
                  <a
                    href="https://linktr.ee/freakfest25?fbclid=PAZXh0bgNhZW0CMTEAAafP8Um1mCZDUTJwN7ycrBZUlKczkpYmY4o-sckpT_lrv2mv5GLld5oGLesphg_aem_j-Yq-E-qVtdEo1w2J_MJyg"
                    target="_blank" rel="noreferrer noopener"
                    className="text-primary hover:underline"
                  >
                    FF/PWA Wrestling Tix 10/19
                  </a>
                </div>
              </div>
              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h3 className="text-xl font-semibold mb-3">Quick Facts</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>Address: 571 Lamar Hwy, Timmonsville, SC 29161</li>
                  <li>Open 6 days a week; see venue site for hours</li>
                  <li>Family- and pet-friendly property</li>
                </ul>
              </div>

              <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-primary/20">
                <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
                <p className="text-muted-foreground">
                  For venue-specific questions, contact Cartersville Country Winery via their website.
                </p>
                <a
                  href="https://cartersvillecountrywinery.com/"
                  target="_blank" rel="noreferrer noopener"
                  className="inline-flex mt-3 items-center px-4 py-2 rounded-md border border-border hover:border-primary/60 transition-colors"
                >
                  Visit Venue Site
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


