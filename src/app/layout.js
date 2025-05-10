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
              <Link className={styles.navBut} href="/">Home</Link>
              <Link className={styles.navBut} href="/ttsList">TTS List</Link>
              <Link className={styles.navBut} href="/imageTools">Image Tools</Link>
              <Link className={styles.navBut} href="/aiList">A.I</Link>
              <Link className={styles.navBut} href="/possibleFeatures">Possible Features</Link>
              <Link className={styles.navBut} href="/mergeTools">Merge Tools</Link>
              <Link className={styles.navBut} href="/ssml">SSML Help</Link>
            </nav>
          </header>

          <main className={styles.main}>
            
              {children}
           
          </main>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
