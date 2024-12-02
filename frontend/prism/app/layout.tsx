// app/layout.tsx
import './globals.css';
import Navbar from '@/app/components/layout/Navbar';
import LoginModal from '@/app/components/authentication/LoginModal'; // Import the modal component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-vapor-dark text-vapor-light font-digital overflow-x-hidden">
        <Navbar />  
        <LoginModal /> {/* Render the modal here */}
        <div className="bg-gradient-overlay"></div>
        <main>
           {children}
        </main>
      </body>
    </html>
  )
}