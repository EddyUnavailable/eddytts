import Link from 'next/link';
import './globals.css';
import styles from './css/layout.module.css'; // ✅ Import the CSS module
import { AudioPlayerProvider } from './components/AudioPlayerContext';

export const metadata = {
  title: 'TTS AI Explorer',
  description: 'Explore free text-to-speech AI tools',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AudioPlayerProvider>
          <header className={styles.header}>
            <nav className={styles.nav}>
              <Link href="/">Home</Link>
              <Link href="/ttsList">TTS List</Link>
              <Link href="/imageTools">Image Tools</Link>
              <Link href="/possibleFeatures">Possible Features</Link>
              <Link href="/mergeTools">Merge Tools</Link>
            </nav>
          </header>
          <main className={styles.main}>{children}</main>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
