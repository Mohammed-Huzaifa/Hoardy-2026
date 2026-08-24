import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Services from '@/components/Services'
import Process from '@/components/Process'
import Work from '@/components/Work'
import About from '@/components/About'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import CursorGlow from '@/components/CursorGlow'
import CursorDot from '@/components/CursorDot'
import TechWorldLayer from '@/components/TechWorldLayer'

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <CursorDot />
      <TechWorldLayer />
      <Header />
      <main className="relative z-10">
        <Hero />
        <TrustBar />
        <Services />
        <Process />
        <Work />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
