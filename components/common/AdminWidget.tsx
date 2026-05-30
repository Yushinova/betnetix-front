"use client";

import { Avatar, Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import styles from "./AdminWidget.module.css";
import { useEffect } from "react";

export default function AdminWidget() {
  const router = useRouter();
  const { admin, logout } = useAuthStore();

  useEffect(() => {
  }, [admin]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!admin) {
    return (
      <div className={styles.widget}>
        <div className={styles.topSection}>
          <Avatar className={styles.avatar}>
            <Avatar.Fallback>?</Avatar.Fallback>
          </Avatar>
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>Нет данных</h3>
            <p className={styles.userEmail}>...</p>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <img src="/exit.png" alt="Выход" width={20} height={20} />
            <span>Выход</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.topSection}>
        <Avatar className={styles.avatar}>
          <Avatar.Image 
            alt={`${admin.firstName} ${admin.lastName}`}
            src={admin.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
          />
          <Avatar.Fallback>
            {admin.firstName?.[0]}{admin.lastName?.[0]}
          </Avatar.Fallback>
        </Avatar>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>
            {admin.firstName} {admin.lastName}
          </h3>
          <p className={styles.userEmail}>{admin.email}</p>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <button onClick={handleLogout} className={styles.logoutButton}>
        <img src="/exit.png" alt="Выход" width={20} height={20} />
        <span>Выход</span>
        </button>
      </div>
    </div>
  );
}