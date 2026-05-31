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
          src="https://storage.yandexcloud.net/backet-online-storage/test/BTX%E2%80%A2.png" 
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