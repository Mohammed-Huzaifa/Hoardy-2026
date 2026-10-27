import Header from '@/components/Header'
import Footer from '@/components/Footer'

/**
 * Shared chrome for the legal pages (/privacy/, /terms/) — same shell as the blog,
 * since the homepage chrome does not live in the root layout.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen bg-[#EEF2FF]">{children}</main>
      <Footer />
    </>
  )
}
