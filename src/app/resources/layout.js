'use client';


import styles from '../css/resources.module.css';
import Link from 'next/link';

export default function layoutResources({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <nav className={styles.navBar}>
          <Link className={styles.navButton} href="/resources">🏠</Link>
          <Link className={styles.navButton} href="/resources/ttsList">🗣️</Link>
          <Link className={styles.navButton} href="/resources/imageTools">🖼️</Link>
          <Link className={styles.navButton} href="/resources/aiList">🤖</Link>
          <Link className={styles.navButton} href="/resources/mergeTools">🧩</Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
