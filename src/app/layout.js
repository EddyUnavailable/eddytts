'use client';

import './globals.css';
import styles from './css/layout.module.css'; // Adjust path if needed
import Link from 'next/link';
import { AudioPlayerProvider } from './components/AudioPlayerContext'; // Adjust this path as necessary

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <AudioPlayerProvider>
          <header className={styles.header}>
            <nav className={styles.nav}>
              <Link href="/">Home</Link>
              <Link href="/ttsList">TTS List</Link>
              <Link href="/imageTools">Image Tools</Link>
              <Link href="/aiList">A.I</Link>
              <Link href="/possibleFeatures">Possible Features</Link>
              <Link href="/mergeTools">Merge Tools</Link>
              <Link href="/ssml">SSML Help</Link>
            </nav>
          </header>

          <main className={styles.main}>
            <div className={styles.leftPane}>
              {/* Optional: Add sidebar or extra navigation */}
            </div>

            <div className={styles.rightPane}>
              {children}
            </div>
          </main>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
