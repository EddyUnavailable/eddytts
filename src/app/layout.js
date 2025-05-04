import Link from 'next/link';
import './globals.css'; // If you have a global CSS file

export const metadata = {
  title: 'TTS AI Explorer',
  description: 'Explore free text-to-speech AI tools',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/">Home</Link>
            <Link href="/ttsList">TTS List</Link>
            <Link href="/imageTools">Image Tools</Link>
          </nav>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  );
}