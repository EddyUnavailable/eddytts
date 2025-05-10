'use client';

import './globals.css';
import styles from './css/layout.module.css'; // Adjust path if needed
import Link from 'next/link';
import { AudioPlayerProvider } from './components/AudioPlayerContext'; // Adjust this path as necessary
import { authMiddleware } from "@clerk/nextjs"

import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth
} from "@clerk/nextjs";

const frontendApi = "YOUR_FRONTEND_API";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={styles.body}>
          <AudioPlayerProvider>
            <header className={styles.header}>
              <nav className={styles.nav}>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal" />
                </SignedOut>
                {/* <SignIn /> */}
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
    </ClerkProvider>
  );
}
