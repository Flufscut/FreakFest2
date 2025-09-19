import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GallerySection from '@/components/GallerySection'

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <GallerySection />
      </main>
      <Footer />
    </div>
  )
}


