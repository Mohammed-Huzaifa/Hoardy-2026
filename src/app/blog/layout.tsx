import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen bg-[#EEF2FF]">{children}</main>
      <Footer />
    </>
  )
}
