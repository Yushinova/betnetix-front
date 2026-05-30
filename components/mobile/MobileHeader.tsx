"use client";

import Image from "next/image";
import Link from 'next/link';
import AdminWidget from "../common/AdminWidget";
import styles from "./MobileHeader.module.css";

export default function MobileHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image 
          src="/BTX•.png" 
          alt="BTX Logo" 
          width={74} 
          height={18}
          className={styles.logoImage}
          priority
        />
      </div>
      <Link href="/profile" className={styles.widgetWrapper}>
        <AdminWidget />
      </Link>
    </header>
  );
}