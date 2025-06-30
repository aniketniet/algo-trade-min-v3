import Footer from "@/components/Footer"
import Header from "@/components/Header"

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="website-main">{children}</main>
      <Footer />
    </>
  )
}