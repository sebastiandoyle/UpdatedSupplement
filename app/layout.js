import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white p-4">
        {children}
      </body>
    </html>
  )
}
