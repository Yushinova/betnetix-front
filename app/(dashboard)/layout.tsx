"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import Sidebar from "@/components/ui/Sidebar";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileFooter from "@/components/mobile/MobileFooter";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, admin } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 566);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    console.log("DashboardLayout mounted, checking auth...");
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("Admin data in DashboardLayout:", admin);
  }, [admin]);

  return (
    <div className={styles.dashboardLayout}>
      {/* Сайдбар - только на десктопе */}
      {!isMobile && <Sidebar />}
      
      {/* Мобильная шапка */}
      {isMobile && <MobileHeader />}
      
      {/* Основной контент */}
      <main className={`${styles.mainContent} ${isMobile ? styles.mobileContent : ''}`}>
        {children}
      </main>
      
      {/* Мобильный футер - внизу, закреплен */}
      {isMobile && <MobileFooter />}
    </div>
  );
}
