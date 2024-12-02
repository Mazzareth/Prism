import './globals.css';
import Navbar from '@/app/components/layout/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-vapor-dark text-vapor-light font-digital overflow-x-hidden">
        <Navbar />
          <div className="bg-gradient-overlay"></div>
        <main>
           {children}
        </main>
      </body>
    </html>
  )
}