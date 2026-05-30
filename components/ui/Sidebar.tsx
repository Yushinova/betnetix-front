"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AdminWidget from "../common/AdminWidget";
import styles from "./Sidebar.module.css";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  iconActive: string;
  path: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: "posts",
      label: "Публикации",
      icon: "/posts.png",
      iconActive: "/posts-active.png",
      path: "/posts"
    },
    {
      id: "admins",
      label: "Администраторы",
      icon: "/admins.png",
      iconActive: "/admins-active.png",
      path: "/admins"
    },
    {
      id: "users",
      label: "Пользователи",
      icon: "/users.png",
      iconActive: "/users-active.png",
      path: "/users"
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.container}>
        {/* Логотип */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image 
              src="/BTX•.png" 
              alt="BTX Logo" 
              width={100} 
              height={25}
              className={styles.logoImage}
              priority
            />
          </div>
        </div>

        {/* Меню */}
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`${styles.menuButton} ${
                isActive(item.path) ? styles.active : ""
              }`}
            >
              <span className={styles.iconWrapper}>
                <Image 
                  src={isActive(item.path) ? item.iconActive : item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={styles.icon}
                />
              </span>
              <span className={styles.buttonText}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Виджет админа внизу */}
        <div 
          className={styles.widgetWrapper} 
          onClick={() => router.push("/profile")}
          style={{ cursor: 'pointer' }}
        >
        <AdminWidget />
      </div>
      </div>
    </aside>
  );
}