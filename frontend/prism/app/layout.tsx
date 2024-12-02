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
        <footer className="p-4 bg-vapor-dark text-vapor-pink text-center font-scan">
          <p>Prism © {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  )
}